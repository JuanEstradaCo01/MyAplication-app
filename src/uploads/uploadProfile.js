const multer = require("multer")

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"./documentsFile/profiles")
    },
    filename: function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

const uploadProfile = multer({storage: storage})

module.exports = uploadProfile