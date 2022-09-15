const path = require("path");
const fs = require("fs");
const { readFil, writeFile } = require("fs/promises");

/**
 * 合并所有的 markdown 文件
 * @param {Array} fileItems
 */
async function mergeMarkdownFiles(fileItems, options) {
  let content = "";
  for (item of fileItems) {
    const text = await readFile(item.file);
    content += text;
  }

  const targetFile = path.join(options.dir, options.fileName);
  await writeFile(targetFile, content);
}

module.exports = {
  mergeMarkdownFiles,
};
