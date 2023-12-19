import React, { Fragment, useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import 'bootstrap/dist/css/bootstrap.min.css'
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
  const closeSearch = () => {
    setSearchActive(false)
    setValue('')
  }
  useEffect(() => {
    const searchHandle = (e) => {
      const { keyCode } = e
      // 回车
      if (keyCode === 13 && searchActive) {
        onSearch(value)
      }
      // esc
      if (keyCode === 27 && searchActive) {
        closeSearch()
      }
      return
    }
    document.addEventListener('keyup', searchHandle)
    return () => {
      document.removeEventListener('keyup', searchHandle)
    }
  })
  useEffect(() => {
    if (searchActive) {
      oInput.current.focus()
    }
  }, [searchActive])
  return (
    <Fragment>
      {!searchActive && (
        <>
          <SearchDiv>
            <span>{title}</span>
            <span
              onClick={() => {
                setSearchActive(true)
              }}
            >
              搜索
            </span>
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
            <span onClick={closeSearch}>关闭</span>
          </SearchDiv>
        </>
      )}
    </Fragment>
  )
}

export default SearchFile
