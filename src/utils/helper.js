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
