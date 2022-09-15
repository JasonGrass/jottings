const path = require("path");
const fs = require("fs");
const { readdir } = require("fs/promises");
const _ = require("lodash");

const { isFolderExisted } = require("./utils/io");
const { mergeMarkdownFiles } = require("./markdownFileMerger");

async function build(folder) {
  console.log(`[Build] start build from ${folder}`);

  const journalsFolder = path.join(folder, "journals");
  if (!(await isFolderExisted(journalsFolder))) {
    console.log(`[Build] 目录不存在 ${journalsFolder}`);
    return;
  }

  let files = await readdir(journalsFolder);

  files = files
    .filter((f) => path.extname(f).toLowerCase() == ".md")
    .map((f) => {
      return {
        ...parseFileName(f),
        fileName: f,
        file: path.join(journalsFolder, f),
      };
    });

  const group = classifyFile(files);
  buildMergeMarkdownFile(group);
}

function buildMergeMarkdownFile(group) {
  _.forEach(group, function (value, key) {
    const title = key;
    const fileItems = value;
    const item = fileItems[0];

    mergeMarkdownFiles(fileItems, {
      title,
      fileName: `${item.year}${item.month}.md`,
      dir: "..\\docs\\journals",
    });
  });
}

/**
 * 对扫描到的 markdown，安装年月进行分类
 */
function classifyFile(fileItems) {
  return _.groupBy(fileItems, (item) => {
    return `${item.year} 年 ${item.month} 月`;
  });
}

/**
 * 从文件名解析出 markdown 编写的 年月日
 */
function parseFileName(fileName) {
  const group = _.split(fileName, /_|\./, 3);
  return {
    year: group[0],
    month: group[1],
    day: group[2],
  };
}

module.exports = build;
