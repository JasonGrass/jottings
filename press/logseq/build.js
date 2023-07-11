const path = require("path");
const fs = require("fs");
const { readdir, writeFile } = require("fs/promises");
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

  // 找到所有的 md 文件
  files = files
    .filter((f) => path.extname(f).toLowerCase() == ".md")
    .map((f) => {
      return {
        ...parseFileName(f),
        fileName: f,
        file: path.join(journalsFolder, f),
      };
    });

  // 按照 年和月 进行分组
  /*
  {
    "yyyymm":[{
      year: '2023',
      month: '07',
      day: '09',
      fileName: '2023_07_09.md',
      file: '...\\LogseqRepo\\jottings\\journals\\2023_07_09.md'
    }]
  }
  */
  const group = classifyFile(files);
  buildMergeMarkdownFile(group);
}

function buildMergeMarkdownFile(group) {
  const fileList = [];

  // 合并所有单日的 MD 文件
  _.forEach(group, function (value, key) {
    const title = key;
    const fileItems = value;
    const fileName = `${fileItems[0].year}${fileItems[0].month}`;
    fileList.push(fileName);

    const options = {
      title,
      fileName: `${fileName}.md`,
      dir /* 目标 MD 文件所在的目录*/: ".\\docs\\journals", // 相对于 package.json 所在目录
    };
    mergeMarkdownFiles(fileItems, options);
  });

  // 生成 sidebar.journals.js 文件（提供 sidebar 导航数据）
  buildSidebarJournals(fileList);
}

/**
 * 对扫描到的 markdown，按照年月进行分类
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

function buildSidebarJournals(fileList) {
  const targetFile = path.join(
    process.cwd(),
    "docs",
    ".vitepress",
    "sidebar.journals.js"
  );
  let lines = "export default [\r\n";
  for (const fileName of fileList) {
    lines += `{ text: "${fileName}", link: "/journals/${fileName}" },\n`;
  }
  lines += "];";

  writeFile(targetFile, lines);
}

module.exports = build;
