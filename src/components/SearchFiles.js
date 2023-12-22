import React, { Fragment, useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import useKeyHandler from '../hooks/useKeyHandler'
import useIpcRenderer from '../hooks/useIpcRenderer'
// 自定义搜索区域的div
let SearchDiv = styled.div.attrs({
  className: 'd-flex align-center justify-content-between',
})`
  border-bottom: 1px solid #ffffff;
  span {
    color: #fff;
    padding: 0 10px;
    font: normal 16px/40px '微软雅黑';
  }
  input {
    margin: 10px;
    border: none;
    border-radius: 4px;
  }
`
const SearchFile = ({ title, onSearch }) => {
  const [searchActive, setSearchActive] = useState(false)
  const [value, setValue] = useState('')
  const oInput = useRef(null)
  const enterPressed = useKeyHandler(13)
  const escPressed = useKeyHandler(27)
  const closeSearch = () => {
    setSearchActive(false)
    setValue('')
    // 当我们关闭搜索功能时候，可以给它提供一个空字符，这样就没有满足条件的搜索
    // 结果，此时就能将原来的列表数据重新展示出来
    onSearch('')
    // console.log('escPressed')
  }

  useEffect(() => {
    if (enterPressed && searchActive) {
      onSearch(value)
    }
    if (escPressed && searchActive) {
      closeSearch()
    }
  }, [enterPressed, escPressed, searchActive])
  //   useEffect(() => {
  //     const searchHandle = (e) => {
  //       const { keyCode } = e
  //       // 回车
  //       if (keyCode === 13 && searchActive) {
  //         onSearch(value)
  //       }
  //       // esc
  //       if (keyCode === 27 && searchActive) {
  //         closeSearch()
  //       }
  //       return
  //     }
  //     document.addEventListener('keyup', searchHandle)
  //     return () => {
  //       document.removeEventListener('keyup', searchHandle)
  //     }
  //   })

  useEffect(() => {
    if (searchActive) {
      oInput.current.focus()
    }
  }, [searchActive])

  useIpcRenderer({
    'execute-search-file': () => {
      setSearchActive(true)
    },
  })
  return (
    <Fragment>
      {!searchActive && (
        <>
          <SearchDiv>
            <span>{title}</span>
            {/* <span
              onClick={() => {
                setSearchActive(true)
              }}
            >
              <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
            </span> */}
          </SearchDiv>
        </>
      )}
      {searchActive && (
        <>
          <SearchDiv>
            <input
              ref={oInput}
              value={value}
              onChange={(ev) => {
                setValue(ev.target.value)
              }}
            />
            <span onClick={closeSearch}>
              <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
            </span>
          </SearchDiv>
        </>
      )}
    </Fragment>
  )
}
// 定义参数类型
SearchFile.propTypes = {
  title: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
}
// 默认值的使用
SearchFile.defaultProps = {
  title: '文档列表',
}

export default SearchFile
