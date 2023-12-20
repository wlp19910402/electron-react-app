import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
// 自定义 ul 标签
let TabUl = styled.ul.attrs({
  className: 'nav nva-pills',
})`
  border-bottom: 1px solid #fff;
  li a {
    color: #fff;
    border-radius: 0;
  }
  li a.active {
    background-color: #3e403f;
    color: #fff;
  }
  .nav-link.unSaveMarks .rounded-circle {
    width: 12px;
    height: 12px;
    display: inline-block;
    background-color: #b80233;
  }
  .nav-link.unSaveMarks .icon-close {
    display: none;
  }
  .nav-link.unSaveMarks:hover .icon-close {
    display: inline-block;
  }
  .nav-link.unSaveMarks:hover .rounded-circle {
    display: none !important;
  }
`

const TabList = ({ files, activeItem, unSaveItems, clickItem, closeItem }) => {
  return (
    <TabUl>
      {files.map((file) => {
        //定义变量控制未保存状态
        let unSaveMarks = unSaveItems.includes(file.id)
        //组合类型操作
        let finalClass = classNames({
          'nav-link': true,
          active: activeItem === file.id,
          unSaveMarks,
        })
        return (
          <li className="nav-item" key={file.id}>
            <a
              href="#"
              className={finalClass}
              onClick={(e) => {
                e.preventDefault() //阻止默认事件
                clickItem(file.id)
              }}
            >
              {file.title}

              <span
                className="ms-2 icon-close"
                onClick={(e) => {
                  e.stopPropagation() //去掉冒泡
                  closeItem(file.id)
                }}
              >
                <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
              </span>

              {unSaveMarks && <span className="ms-2 rounded-circle"></span>}
            </a>
          </li>
        )
      })}
    </TabUl>
  )
}
TabList.propTypes = {
  files: PropTypes.array,
  activeItem: PropTypes.string,
  unSaveItems: PropTypes.array,
  clickItem: PropTypes.func,
  closeItem: PropTypes.func,
}
TabList.defaultProps = {
  unSaveItems: [],
}
export default TabList
