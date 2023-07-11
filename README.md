<img src="assets/logo.png" width=64/>

# jottings

## 简介

将 logseq 日志，使用 vitepress 构建成静态站点，使用 github pages 发布。

[https://jasongrass.github.io/jottings](https://jasongrass.github.io/jottings/)

## 构建与发布

通过 logseq 的记录，自动整理生成带发布的文档

1 在 `./press/logseq/secret.js` 文件中，指定 logseq 的本地保存路径

```js
module.exports = {
  // logseq 的本地保存目录
  logseqPathStandby: [
    `C:\\Users\\......\\LogseqRepo\\jottings`,
  ],
};
```

2 运行命令进行自动收集和整理

```sh
yarn logseq
```

最终将输出待 vitepress 消费的 docs 数据

3 使用 vitepress 进行调试

```sh
yarn docs:dev
```

4 发布

```sh
yarn deploy
```

此命令将指定 `deploy.sh` 中的脚本，将完整流程跑一遍：收集 logseq 数据，静态站点，然后推送到指定的 git 仓库中。
在 github 上，配置 Pages，以完成静态站点的发布。

## 日常更新

日常在 logseq 中更新内容之后，如果需要发布，则需要在此仓库下运行

```sh
yarn deploy
```
