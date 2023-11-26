const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../public/img")//-->Donde se quiere guardar el archivo
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)//-->Como queremos que se llame el archivo
    }
})

const uploader = multer ({
    storage: storage
})

module.exports = uploader