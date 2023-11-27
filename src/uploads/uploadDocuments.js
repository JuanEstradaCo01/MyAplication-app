const multer = require("multer")

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"./documentsFile/documents")
    },
    filename: function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

const uploadOtherDocuments = multer({storage: storage})

module.exports= uploadOtherDocuments