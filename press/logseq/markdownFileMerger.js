const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const {
  readFile,
  writeFile,
  open,
  unlink,
  appendFile,
} = require("fs/promises");

const { isFileExisted } = require("./utils/io");

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

    const text = await readFile(item.file);

    await appendFile(targetFile, removeTextPrefix(text));
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
    content += `${line}\r\n`;
  });

  return content;
}

module.exports = {
  mergeMarkdownFiles,
};
