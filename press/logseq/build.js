const path = require("path");
const fs = require("fs");
const { readdir } = require("fs/promises");

const { isFolderExisted } = require("./utils/io");

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
      return { file: path.join(journalsFolder, f) };
    });
  console.log(files);
}

module.exports = build;
