import React, { useEffect, useState } from 'react'
import { v4 } from 'uuid'
import styled from 'styled-components'
import 'bootstrap/dist/css/bootstrap.min.css'
import SearchFile from './components/SearchFiles'
import FileList from './components/FileList'
import ButtonItem from './components/ButtonItem'
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'
import TabList from './components/TabList'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'
import {
  mapArr,
  objToArr,
  readFile,
  writeFile,
  renameFile,
  deleteFile,
} from './utils/helper'
const path = window.require('path')
const { app, dialog } = window.require('@electron/remote')
const Store = window.require('electron-store')
const fileStore = new Store({ name: 'filesInfo' })
// 定义方法实现具体属性的持久化存储
const saveInfoToStore = (files) => {
  const storeObj = objToArr(files).reduce((ret, file) => {
    const { id, title, createTime, path } = file
    ret[id] = { id, path, title, createTime }
    return ret
  }, {})
  fileStore.set('files', storeObj)
}

// // 自定义左侧容器
let LeftDiv = styled.div.attrs({
  className: 'col-3 left-panel',
})`
  background-color: #7b8c7c;
  min-height: 100vh;
  position: relative;
  .btn-list {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    p {
      width: 50%;
      color: #fff;
      border-radius: 0;
    }
    p:nth-of-type(1) {
      background-color: #8ba39e;
    }
    p:nth-of-type(2) {
      background-color: #98b4b3;
    }
  }
`
// 自定义右侧容器
let RightDiv = styled.div.attrs({
  className: 'col-9 right-panel',
})`
  background-color: #c9d8cd;
  .init-page {
    font: normal 28px/300px '微软雅黑';
    color: #888;
    text-align: center;
  }
`
function App() {
  const [files, setFiles] = useState(fileStore.get('files') || {}) //代表所有文件信息
  const [activeId, setActiveId] = useState('') //当前正在编辑文件的id
  const [openIds, setOpenIds] = useState([]) //当前已经打开的文件信息 ids
  const [unSaveIds, setUnSaveIds] = useState([]) //当前未被保存的文件信息的 ids
  const [searchFiles, setSearchFiles] = useState([])

  // 自定义一个当前磁盘存放文件的位置的路径
  const savePath =
    app.getPath('home') +
    '/workspace/szbStudyProject/electron-react-app/localFile'
  console.log(app.getPath('userData'))

  // 打开的文件
  const openFiles = openIds.map((openId) => files[openId])
  // 计算正在编辑的文件信息
  const activeFile = files[activeId]

  //01 点击左侧文件显示编辑页面
  const openItem = (id) => {
    setActiveId(id)
    // 点击某个文件项时读取里面的内容显示
    const currentFile = files[id]
    if (!currentFile.isLoaded) {
      readFile(currentFile.path)
        .then((data) => {
          const newFile = { ...currentFile, body: data, isLoaded: true }
          setFiles({ ...files, [id]: newFile })
        })
        .catch(() => {
          // 文件可能被删除了，读取不到
          // let obj = { ...files }
          // delete obj[id]
          // saveInfoToStore(obj)
        })
    }
    setOpenIds([...new Set([...openIds, id])])
  }
  // 02 点击某个选项时切换当前状态
  const changeActive = (id) => {
    setActiveId(id)
  }
  // 03 点击关闭按钮
  const closeFile = (id) => {
    let retOpen = openIds.filter((item) => item !== id)
    setOpenIds(retOpen)
    if (retOpen.length > 0 && activeId === id) setActiveId(retOpen[0])
    else if (retOpen.length > 0 && activeId !== id) setActiveId(activeId)
    else setActiveId('')
  }
  // 04 当文件内容更新时候
  const changeFile = (id, newValue) => {
    setUnSaveIds([...new Set([...unSaveIds, id])])
    // 某个内容更新之后我们需要生成新的files
    const newFile = { ...files[id], body: newValue }
    setFiles({ ...files, [id]: newFile })
  }
  // 05 删除某个文件项
  const deleteItem = (id) => {
    const file = files[id]
    let obj = { ...files }
    if (!file.isNew) {
      deleteFile(file.path).then(() => {
        delete obj[id]
        setFiles(obj)
        saveInfoToStore(obj)
        // 如何当前要关闭的项目正在被打开，相应的也进行删除
        closeFile(id)
      })
    } else {
      delete obj[id]
      setFiles(obj)
      saveInfoToStore(obj)
      // 如何当前要关闭的项目正在被打开，相应的也进行删除
      closeFile(id)
    }
  }
  // 06 依据关键字搜索文件
  const searchfile = (keyWord) => {
    const newFiles = objToArr(files).filter((item) =>
      item.title.includes(keyWord)
    )
    setSearchFiles(newFiles)
  }
  useEffect(
    () => {
      searchfile('')
    },
    [files],
    { deep: true }
  )

  // 07 重命名
  const saveData = (id, newTitle, isNew) => {
    const item = objToArr(files).find((item) => item.title === newTitle)
    if (item) {
      newTitle += '_copy'
    }
    // console.log(path.dirname(files[id].path))
    // console.log('======')
    const newPath = isNew
      ? path.join(savePath, `${newTitle}.md`)
      : path.join(path.dirname(files[id].path), `${newTitle}.md`)
    const newFile = {
      ...files[id],
      title: newTitle,
      isNew: false,
      path: newPath,
    }
    const newFiles = { ...files, [id]: newFile }
    if (isNew) {
      // 执行创建
      writeFile(newPath, files[id].body).then(() => {
        setFiles(newFiles)
        saveInfoToStore(newFiles)
      })
    } else {
      // 执行更新
      let oldPath = files[id].path
      console.log(oldPath, newPath)
      renameFile(oldPath, newPath).then(() => {
        setFiles(newFiles)
        saveInfoToStore(newFiles)
      })
    }
  }

  // 08 新建操作
  const createFile = () => {
    const newId = v4()
    let newFile = {
      id: newId,
      title: '',
      isNew: true,
      body: '## 初始化内容',
      createTime: new Date().getTime(),
    }
    let flag = objToArr(files).find((file) => file.isNew)
    !flag && setFiles({ ...files, [newId]: newFile })
  }
  // 09 点击保存文件内容
  const saveCurrentFile = () => {
    writeFile(activeFile.path, activeFile.body).then(() => {
      setUnSaveIds(unSaveIds.filter((id) => id !== activeFile.id))
    })
  }

  // 10 执行外部md，导入数据
  const importFile = () => {
    dialog
      .showOpenDialog({
        defaultPath: __dirname,
        buttonLabel: '请选择',
        title: '选择md文件',
        properties: ['openFile', 'multiSelections'],
        filters: [
          { name: 'md文档', extensions: ['md'] },
          { name: '其他类型', extensions: ['js', 'json', 'html'] },
        ],
      })
      .then((ret) => {
        let paths = ret.filePaths
        // console.log(ret.filePaths)
        if (paths.length) {
          // 判断当前路径们是否已经存在files中，如果已经存在则无需执行导入操作
          const validPaths = paths.filter((filePath) => {
            // 判断当前path是否已经存在过了
            const existed = Object.values(files).find(
              (file) => file.path === filePath
            )
            return !existed
          })
          // 将上述的路径信息组装成files格式
          const packageData = validPaths.map((filePath) => ({
            id: v4(),
            title: path.basename(filePath, '.md'),
            path: filePath,
          }))
          // 将上述的数据格式处理未files所需要的
          let newFiles = { ...files, ...mapArr(packageData) }
          // 更新数据，重新渲染
          setFiles(newFiles)

          // 成功导入提示
          if (packageData.length) {
            saveInfoToStore(newFiles)
            dialog.showMessageBox({
              title: '导入md文档',
              type: 'info',
              message: '文件导入成功',
            })
          }
        } else {
          console.log('未选择文件导入')
        }
      })
  }
  return (
    <div className="App container-fluid g-0">
      <div className="row g-0">
        <LeftDiv>
          <SearchFile title="我的文档" onSearch={searchfile} />
          <FileList
            files={searchFiles}
            editFile={openItem}
            deleteFile={deleteItem}
            saveFile={saveData}
          />
          <div className="btn-list">
            <ButtonItem title={'新增'} icon={faPlus} btnClick={createFile} />
            <ButtonItem
              title={'导入'}
              icon={faFileImport}
              btnClick={importFile}
            />
          </div>
        </LeftDiv>
        <RightDiv>
          <button onClick={saveCurrentFile}>保存</button>
          {activeFile && (
            <>
              <TabList
                files={openFiles}
                activeItem={activeId}
                clickItem={changeActive}
                unSaveItems={unSaveIds}
                closeItem={closeFile}
              ></TabList>

              <SimpleMDE
                key={activeFile && activeFile.id}
                onChange={(value) => {
                  changeFile(activeFile.id, value)
                }}
                value={activeFile.body}
                options={{
                  autofocus: true,
                  spellChecker: false,
                  minHeight: '470px',
                }}
              />
            </>
          )}
          {!activeFile && (
            <div className="init-page">新建或者导入具体的文档</div>
          )}
        </RightDiv>
      </div>
    </div>
  )
}

export default App
