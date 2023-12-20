import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFileAlt,
  faEdit,
  faTrashAlt,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import initFiles from '../utils/initFiles'
import useKeyHandler from '../hooks/useKeyHandler'
//ul 标签
let GroupUl = styled.ul.attrs({
  className: 'list-group list-group-flush',
})`
  li {
    color: #fff;
    background: none;
    border: none;
  }
`

const FileList = ({ files, editFile, saveFile, deleteFile }) => {
  const [editItem, setEditItem] = useState(false)
  const [value, setValue] = useState('')
  const enterPressed = useKeyHandler(13)
  const escPressed = useKeyHandler(27)
  // 定义关闭行为
  const closeFn = () => {
    setEditItem(false)
    setValue('')

    // const currentFile = files.find((file) => file.id === editItem)
    // if (currentFile && currentFile.isNew) {
    //   deleteFile(editItem)
    // }
  }
  // 键盘的事件操作
  useEffect(() => {
    if (enterPressed && editItem && value.trim()) {
      saveFile(editItem, value)
      closeFn()
    }
    if (escPressed && editItem) {
      closeFn()
    }
  }, [escPressed, editItem, enterPressed])

  useEffect(() => {
    const newFile = files.find((item) => item.isNew)
    if (newFile) {
      setEditItem(newFile.id)
      setValue(newFile.title)
    }
  }, [files])
  // 当页面存在新建，未保存情况下又操作其他标题编辑
  useEffect(() => {
    const newFile = files.find((file) => file.isNew)
    if (newFile && editItem && editItem !== newFile.id) {
      // 此时就说嘛我们本意新增一个文件，但是没有将新建文件操作完成就又去点击了其他文件项
      deleteFile(newFile.id)
    }
  }, [editItem])
  return (
    <GroupUl>
      {files.map((file) => (
        <li className="list-group-item d-flex align-items-center" key={file.id}>
          {file.id !== editItem && !file.isNew && (
            <>
              <span className="col-1">
                <FontAwesomeIcon icon={faFileAlt}></FontAwesomeIcon>
              </span>
              <span
                className="col-8"
                onClick={() => {
                  editFile(file.id)
                  closeFn()
                }}
              >
                {file.title}
              </span>
              <span
                className="col-2"
                onClick={() => {
                  setEditItem(file.id)
                  setValue(file.title)
                }}
              >
                <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
              </span>
              <span
                className="col-1"
                onClick={() => {
                  deleteFile(file.id)
                }}
              >
                <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
              </span>
            </>
          )}
          {(file.id === editItem || file.isNew) && (
            <>
              <input
                className="col-10"
                value={value}
                onChange={(ev) => {
                  setValue(ev.target.value)
                }}
                onClick={() => setEditItem(file.id)}
              />

              <span className="col-1" onClick={closeFn}>
                <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
              </span>
            </>
          )}
        </li>
      ))}
    </GroupUl>
  )
}
FileList.prototype = {
  files: PropTypes.array.isRequired,
  editFile: PropTypes.func.isRequired,
  deleteFile: PropTypes.func.isRequired,
  saveFile: PropTypes.func.isRequired,
}
FileList.defaultProps = {
  files: initFiles,
}

export default FileList
