const multer = require("multer")

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"./documentsFile/products")
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
})

const uploadProduct = multer({storage: storage})

module.exports = uploadProduct