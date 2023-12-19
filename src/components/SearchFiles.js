import React, { Fragment, useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
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
              <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
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
            <span onClick={closeSearch}>
              <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
            </span>
          </SearchDiv>
        </>
      )}
    </Fragment>
  )
}

SearchFile.propTypes = {
  title: PropTypes.string,
  noSearch: PropTypes.func.isRequired,
}

export default SearchFile
