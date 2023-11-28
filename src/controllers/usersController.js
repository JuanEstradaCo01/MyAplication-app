const UsersService = require("../services/usersService")
const ProductDao = require("../dao/DBProductManager")
const productDao = new ProductDao()

class UsersController {
    constructor() {
        this.service = new UsersService()
    }

    async getUsers(req, res) {
        try {
            const users = await this.service.getUsers()
            return res.status(200).json(users)
        } catch (e) {
            req.logger.error("Ha ocurrido un error al buscar los usuarios")
            return res.status(500).json({ Error: "Ha ocurrido un error al buscar los usuarios" })
        }
    }

    async getUserById(req, res) {
        const uid = req.params.uid
        const role = req.params.rol
        try {
            const user = await this.service.getUserById(uid)
            if (!user) {
                req.logger.warning("No se encontro el usuario")
                return res.status(404).json({ error: "No se encontro el usuario" })
            }
            user.typeCount = role
            user.provider = "Local"
            const cartId = user.cart

            return res.status(200).json(user)
        } catch (e) {
            req.logger.error(`Ha ocurrido un error al buscar el usuario con el ID: ${uid}`)
            return res.status(500).json({ Error: `Ha ocurrido un error al buscar el usuario con el ID: ${uid}` })
        }
    }

    async updateUser(req, res) {
        try {
            const body = req.body
            const uid = req.params.uid
            await this.service.updateUser(uid, body)
            req.logger.info("¡Usuario modificado exitosamente!")
            return res.status(200).json(body)
        } catch (e) {
            req.logger.error("Ha ocurrido un erro al modificar el usuario")
            return res.status(500).json({ error: "Ha ocurrido un erro al modificar el usuario" })
        }
    }

    async deleteUser(req, res) {
        const uid = req.params.uid
        
        try{
            const user = await this.service.getUserById(uid)
            if(!user){
                req.logger.error("El usuario no fue encontrado")
                return res.status(404).json({NotFound: "El usuario no fue encontrado"})
            }

            await this.service.deleteUser(uid)
        
            req.logger.info(`Se ha eliminado el usuario ${user.first_name}`)

            return res.status(200).json({OK: `Se ha eliminado el usuario ${user.first_name}`})
        }catch (e) {
            req.logger.fatal("Ha ocurrido un error al eliminar el usuario")
            return res.status(500).json({error: "Ha ocurrido un error al eliminar el usuario"})
        }
    }

    async uploadDocuments(req, res) {
        const uid = req.params.uid
        const body = req.body
        const file = req.files

        try {
            const docs = []

            file.forEach(function (item) {
                const doc = {
                    name: body.name,
                    reference: item.path
                }
                docs.push(doc)
            })

            const user = await this.service.getUserById(uid)

            if (!user) {
                req.logger.error(`No se ha encontrado el usuario con el ID:${uid}`)
                return res.status(404).json({ Error: `No se ha encontrado el usuario con el ID:${uid}` })
            }

            if (user.documents.length > 0) {
                user.documents.forEach(function (item) {
                    const doc = {
                        name: item.name,
                        reference: item.reference
                    }
                    docs.push(doc)
                })
            }

            const upload = await this.service.uploadDocuments(user._id, docs)

            if (!upload) {
                req.logger.error("Ocurrio un error al subir el documento")
            }

            req.logger.info(`¡Documento de ${user.first_name} subido exitosamente!`)

            return res.status(200).json({ ok: `¡Documento de ${user.first_name} subido exitosamente!` })

        } catch (e) {
            req.logger.fatal("Ha ocurrido un error al cargar el documento")
            return res.status(500).json({ Error: "Ha ocurrido un error al cargar el documento" })
        }
    }

    async uploadProfileImage(req, res) {
        const uid = req.params.uid
        const file = req.file
        try {
            const user = await this.service.getUserById(uid)
            if (!user) {
                req.logger.error(`No se ha encontrado el usuario con el ID:${uid}`)
                return res.status(404).json({ Error: `No se ha encontrado el usuario con el ID:${uid}` })
            }
            user.image = file.path

            await this.service.uploadProfileImage(user._id, user)
            req.logger.info(`¡Se actualizó correctamente la imagen de perfil de ${user.first_name}!`)
            return res.status(200).json({ ok: `¡Se actualizó correctamente la imagen de perfil de ${user.first_name}!` })
        } catch (e) {
            req.logger.fatal("Ha ocurrido un error al actualizar la imagen de perfil")
            return res.status(500).json({ error: "Ha ocurrido un error al actualizar la imagen de perfil" })
        }
    }

    async getUserByIdWithRol(req, res) {
        const uid = req.params.uid
        const role = req.params.rol
        try {
            const user = await this.service.getUserById(uid)
            if (!user) {
                req.logger.warning("No se encontro el usuario")
                return res.status(404).json({ error: "No se encontro el usuario" })
            }
            user.typeCount = role
            user.provider = "Local"
            const cartId = user.cart
            const userDocuments = user.documents

            //Busco y valido si existe un documento con el name 'identificacion':
            const findIdentificacion = userDocuments.find(item=>item.name === "identificacion")

            //Busco y valido si existe un documento con el name 'domicilio':
            const findDomicilio = userDocuments.find(item=>item.name === "domicilio")

            //Busco y valido si existe un documento con el name 'estado de cuenta':
            const findEstadoDeCuenta = userDocuments.find(item=>item.name === "estado de cuenta")

            //Valido si el usuario completó toda la documentacion y autorizo cambiar a 'Premium':
            if((findIdentificacion === undefined || 
                findDomicilio === undefined || 
                findEstadoDeCuenta === undefined) & (role === "Premium")){
                    return res.status(401).json({Unauthorized: "No has terminado de cargar la documentacion (identificacion, domicilio o estado de cuenta)"})
                }

            const products = await productDao.getProducts()

            if(role === "Premium"){
                return res.render("profileParamsPremium", {user, cartId, products})
            }
            if(role === "User"){
                return res.render("profileParamsUser", {user,cartId,products})
            }

            return res.status(404).json({NotFound: "No existe el rol especificado"})
        } catch (e) {
            req.logger.error(`Ha ocurrido un error al buscar el usuario con el ID: ${uid}`)
            return res.status(500).json({ Error: `Ha ocurrido un error al buscar el usuario con el ID: ${uid}` })
        }
    }
}

module.exports = UsersController