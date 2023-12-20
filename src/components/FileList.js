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
  }
  // 键盘的事件操作
  useEffect(() => {
    if (enterPressed && editItem) {
      saveFile(editItem, value)
      closeFn()
    }
    if (escPressed && editItem) {
      closeFn()
    }
  }, [escPressed, editItem, enterPressed])

  return (
    <GroupUl>
      {files.map((file) => (
        <li className="list-group-item d-flex align-items-center" key={file.id}>
          {file.id !== editItem && (
            <>
              <span className="col-1">
                <FontAwesomeIcon icon={faFileAlt}></FontAwesomeIcon>
              </span>
              <span
                className="col-8"
                onClick={() => {
                  editFile(file.id)
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
              <span className="col-1" onClick={() => deleteFile(file.id)}>
                <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
              </span>
            </>
          )}
          {file.id === editItem && (
            <>
              <input
                className="col-10"
                value={value}
                onChange={(ev) => {
                  setValue(ev.target.value)
                }}
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
