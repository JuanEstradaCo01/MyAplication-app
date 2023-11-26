const UsersController = require("../controllers/usersController")
const BaseRouter = require("./BaseRouter")
const usersController = new UsersController()
const uploader = require("../utils/multer")

class UserRouter extends BaseRouter {
    init() {
        this.get("/", usersController.getUsers.bind(usersController))

        this.get("/:uid", usersController.getUserById.bind(usersController))

        this.get("/:role/:uid", usersController.getUserById.bind(usersController))

        this.put("/:uid", usersController.updateUser.bind(usersController))

        this.post("/:uid/documents",uploader.array("file"), usersController.uploadDocuments.bind(usersController))
    }
}

module.exports = UserRouter