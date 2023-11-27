const UsersController = require("../controllers/usersController")
const BaseRouter = require("./BaseRouter")
const usersController = new UsersController()
const uploadProfile = require("../uploads/uploadProfile")

class UserRouter extends BaseRouter {
    init() {
        this.get("/", usersController.getUsers.bind(usersController))

        this.get("/:uid", usersController.getUserById.bind(usersController))

        this.put("/:uid", usersController.updateUser.bind(usersController))

        this.get("/:rol/:uid", usersController.getUserById.bind(usersController))

        //Endpoint donde cargo documentos con Multer
        this.post("/:uid/documents",uploadProfile.array("reference"), usersController.uploadDocuments.bind(usersController))

        //Endpoint donde cargo la imagen de perfil con Multer
        this.put("/:uid/profile",uploadProfile.single("path"), usersController.uploadProfileImage.bind(usersController))
    }
}

module.exports = UserRouter