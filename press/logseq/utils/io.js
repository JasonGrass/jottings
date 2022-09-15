
/**
 * 判断文件夹是否存在
*/
function isFolderExisted(path_way) {
  return new Promise((resolve, reject) => {
    fs.access(path_way, (err) => {
      if (err) {
        resolve(false); //"不存在"
      } else {
        var info = fs.statSync(path_way);
        if (info.isDirectory()) {
          resolve(true); //"存在"
        } else {
          resolve(false); //"不存在"
        }
      }
    });
  });
}

module.exports = {
    isFolderExisted
};
