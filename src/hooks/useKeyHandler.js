import { useState, useEffect } from 'react'

const useKeyHandler = (code) => {
  const [keyPressed, setKeyPress] = useState(false)

  // 按下
  const keyDownHandler = ({ keyCode }) => {
    if (keyCode === code) {
      setKeyPress(true)
    }
  }
  // 抬起
  const keyUpHandler = ({ keyCode }) => {
    if (keyCode === code) {
      setKeyPress(false)
    }
  }
  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('keyup', keyUpHandler)
    return () => {
      document.removeEventListener('keyup', keyUpHandler)
      document.removeEventListener('keydown', keyDownHandler)
    }
  }, [])
  return keyPressed
}

export default useKeyHandler
