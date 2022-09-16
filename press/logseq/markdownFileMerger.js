"use strict";

const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const {
  readFile,
  writeFile,
  open,
  unlink,
  appendFile,
  copyFile,
  mkdir,
} = require("fs/promises");

const { isFolderExisted, isFileExisted } = require("./utils/io");

/**
 * 合并所有的 markdown 文件
 * @param {Array} fileItems
 */
async function mergeMarkdownFiles(fileItems, options) {
  const targetFile = path.join(options.dir, options.fileName);
  if (await isFileExisted(targetFile)) {
    await unlink(targetFile);
  }

  await appendFile(targetFile, `🍉 ${options.title}\r\n`);

  for (let item of fileItems) {
    await appendFile(
      targetFile,
      `
      \r\n---\r\n
      \r\n🍀 ${item.year} 年 ${item.month} 月 ${item.day} 日 ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏\r\n
      `
    );

    let text = await readFile(item.file);
    text = removeTextPrefix(text);
    text = await replacePicture(text, item.file, options.dir);

    await appendFile(targetFile, removeTextPrefix(text));
    await appendFile(
      targetFile,
      `
      \r\n...  \r\n
      `
    );
  }
}

/**
 * 移除 logseq 文本前面的 `-`
 *
 */
function removeTextPrefix(text) {
  const lines = _.split(text, "\n");
  let content = "";
  _.forEach(lines, (line) => {
    line = _.replace(line, "\t", "  ");
    line = _.trimStart(line, "-");
    line = _.trimEnd(line, "\n");
    content += `${line}  \r\n`; // 这里要有两个空格，Markdown 是换行
  });

  return content;
}

/**
 * 查找并替换文本中的图片引用，并拷贝图片
 */
async function replacePicture(content, originFile, targetFolder) {
  let results = content.matchAll(/!\[.*\](\(.+?\))/g);
  results = Array.from(results);

  for (let match of results) {
    const fileRelativePath = _.trimEnd(_.trimStart(match[1].trim(), "("), ")");
    const dir = path.resolve(originFile, "..");
    const filePath = path.join(dir, fileRelativePath); // 图片文件
    const fileName = path.basename(filePath);

    const assertsFolder = path.join(targetFolder, "asserts");
    if (!(await isFolderExisted(assertsFolder))) {
      await mkdir(assertsFolder);
    }

    const targetFile = path.join(assertsFolder, fileName); // 新复制的文件
    await copyFile(filePath, targetFile);

    content = content.replace(match[1], `(./asserts/${fileName})`);
  }

  return content;
}

module.exports = {
  mergeMarkdownFiles,
};
