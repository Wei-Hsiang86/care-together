const fs = require('fs')

const localFileHandler = file => { // file 是 multer 處理完的檔案
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)

    const fileName = `upload/${file.originalname}` // upload 是對外連接的資料夾其名稱，就是設定路徑以及檔案名稱
    return fs.promises.readFile(file.path) // 讀取 multer 處理完的檔案
      .then(data => fs.promises.writeFile(fileName, data)) // 把 multer 處理完的檔案，寫入到 data，且把 data 放進 fileName 裡面
      .then(() => resolve(`/${fileName}`)) // 把 fileName 的路徑，設為讀取檔案的路徑 (其實變數 fileName 放的是路徑，然後前面那行是把資料放進這個路徑的檔案中)
      .catch(err => reject(err))
  })
}

module.exports = {
  localFileHandler
}
