import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import PropTypes from 'prop-types'
// import useKeyHandler from '../hooks/useKeyHandler'

// 自定义p标签模拟按钮操作
const BtnP = styled.p.attrs({
  className: 'btn border-0 m-0',
})``

const ButtonItem = ({ title, btnClick, icon }) => {
  return (
    <BtnP onClick={btnClick}>
      <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
      <span className="ms-2">{title}</span>
    </BtnP>
  )
}
export default ButtonItem
