#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

rm -rf ./docs/.vitepress/dist

# 生成静态文件
yarn docs:build

# 进入生成的文件夹
cd ./docs/.vitepress/dist

# 如果是发布到自定义域名
# echo 'jgrass.cc' > CNAME

time=$(date "+%Y%m%d-%H%M%S")
message="deploy$time"

git init
git config user.email "junjiegrass@qq.com"
git config user.name "jasongrass"
git add -A
git commit -m $message
git checkout -b public

# 如果发布到 https://<USERNAME>.github.io
git push -f git@github.com:JasonGrass/jottings.git public

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

# 发布到 gitee （需要在 basePathConst 修改根路径之后再编译）
# git push -f https://gitee.com/easinote/client-web-api-documentation.git public

cd -