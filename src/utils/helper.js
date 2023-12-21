const fs = window.require('fs').promises
console.log(window)

// {1:[],2:[]}
export const mapArr = (arr) => {
  return arr.reduce((map, item) => {
    map[item.id] = item
    return map
  }, {})
}
// 获取对应数组
export const objToArr = (obj) => {
  return Object.keys(obj).map((key) => obj[key])
}

// 读取文件内容
export const readFile = (path) => {
  return fs.readFile(path, 'utf-8')
}
//编写文件内容
export const writeFile = (path, content) => {
  return fs.writeFile(path, content, 'utf-8')
}
// 对文件进行重命名
export const renameFile = (path, newPath) => {
  return fs.rename(path, newPath)
}
// 删除文件
export const deleteFile = (path) => {
  return fs.unlink(path)
}
