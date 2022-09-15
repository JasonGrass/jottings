#!zx
// #!/usr/bin/env zx

/*
根据 logseq 中的文件，自动生成 docs 中的文档。
此脚本由 zx 执行，可以在此处使用 Node 的 API。
[google/zx: A tool for writing better scripts](https://github.com/google/zx )
*/

const path = require("path");
const fs = require("fs");

const { asyncFilter } = require("./utils/async");
const { isFolderExisted } = require("./utils/io");

const secretConfig = require("./secret");

const { logseqPathStandby } = secretConfig;

const existLogseqPathStandby = await asyncFilter(
  logseqPathStandby,
  async (folder) => {
    return await isFolderExisted(folder);
  }
);

if (existLogseqPathStandby.length < 1) {
  console.warn("没有找到任何存在的 logseq 目录");
} else if (existLogseqPathStandby.length > 1) {
  existLogseqPathStandby.map((f) => console.table(f));
  console.warn("找到多个存在的 logseq 目录");
} else {
  existLogseqPathStandby.map((f) => console.table(f));
}
