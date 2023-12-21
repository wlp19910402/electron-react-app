import { useEffect, useRef } from 'react'
const { Menu, getCurrentWindow } = window.require('@electron/remote')

function useContextMenu(contentMenuTmp, areaClass) {
  const currentEle = useRef(null)
  useEffect(() => {
    // 获取需要触发右键菜单的区域元素
    const areaEle = document.querySelector(areaClass)
    // 创建menu
    const menu = Menu.buildFromTemplate(contentMenuTmp)
    // 自定义右键操作事件监听
    const contextMenuHandle = (ev) => {
      if (areaEle && areaEle.contains(ev.target)) {
        currentEle.current = ev.target
        menu.popup({ window: getCurrentWindow() })
      }
    }
    window.addEventListener('contextmenu', contextMenuHandle)
    return () => {
      window.removeEventListener('contextmenu', contextMenuHandle)
    }
  })
  return currentEle
}

export default useContextMenu
