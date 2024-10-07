/* eslint-disable no-unused-vars */
// 測試引入 script 用的
function myFunction () {
  const checkBox = document.getElementById('isDanger')
  const text = document.getElementById('test')
  if (checkBox.checked === true) {
    text.style.display = 'block'
  } else {
    text.style.display = 'none'
  }
}
