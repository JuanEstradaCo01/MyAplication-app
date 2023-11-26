const userModel = require("./models/userModel")

class DBUserManager {
    constructor(){
        this.model = userModel
    }

    async getUsers(){
        return this.model.find()
    }

    async getUserById(id){
        return this.model.findById(id)
    }

    async updateUser(id, body) {
        const user = await this.getUserById(id)

        if (!user) {
            throw new Error("El usuario no existe")
        }
        
        const update = {
            _id: body._id || user._id,
            first_name: body.first_name || user.first_name,
            last_name: body.last_name || user.last_name,
            email: body.email || user.email,
            age: body.age || user.age,
            password: user.password,
            typeCount: body.typeCount || user.typeCount,
            date: body.date,
            expiratedLink: body.expiratedLink,
            last_connection: body.last_connection
        }

        await this.model.updateOne({ _id: id}, update)

        return update
    }

    async uploadDocuments(id, body) {
        const user = await this.getUserById(id)

        if (!user) {
            throw new Error("El usuario no existe")
        }

        const documentsStatus = "ready"

        const update = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,user,
            age: user.age,
            typeCount: user.typeCount,
            date: user.date,
            expiratedLink: user.expiratedLink,
            last_connection: user.last_connection,
            documentsStatus: documentsStatus,
            documents: [{
                name: body.name,
                reference: body.reference
            }] 
        }

        await this.model.updateOne({ _id: id}, update)

        return update
    }
}

module.exports = DBUserManager