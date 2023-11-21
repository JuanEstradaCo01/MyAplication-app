const UsersService = require("../services/usersService")

class UsersController {
    constructor() {
        this.service = new UsersService()
    }

    async getUsers(req, res){
        try{
            const users = await this.service.getUsers()
            return res.status(200).json(users)
        }catch(e){
            req.logger.error("Ha ocurrido un error al buscar los usuarios")
            return res.status(500).json({Error: "Ha ocurrido un error al buscar los usuarios"})
        }
    }

    async getUserById(req, res){
        try{
            const uid = req.params.uid
            const user = await this.service.getUserById(uid)
            return res.status(200).json(user)
        }catch(e){
            req.logger.error(`Ha ocurrido un error al buscar el usuario con el ID: ${uid}`)
            return res.status(500).json({Error: `Ha ocurrido un error al buscar el usuario con el ID: ${uid}`})
        }
    }

    async updateUser(req, res){
        try{
            const body = req.body
            const uid = req.params.uid
            await this.service.updateUser(uid, body)
            req.logger.info("¡Usuario modificado exitosamente!")
            return res.status(200).json(body)
        }catch(e){
            req.logger.error("Ha ocurrido un erro al modificar el usuario")
            return res.status(500).json({error: "Ha ocurrido un erro al modificar el usuario"})
        }
    }
}

module.exports = UsersController