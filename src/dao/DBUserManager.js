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
            last_connection: body.last_connection,
            inactivity: body.inactivity
        }

        await this.model.updateOne({ _id: id}, update)

        return update
    }

    async updateRolUser(id, body) {
        const user = await this.getUserById(id)

        if (!user) {
            throw new Error("El usuario no existe")
        }

        const update = {
            typeCount: body.typeCount
        }

        await this.model.updateOne({ _id: id}, update)

        return update
    }

    async deleteUser(id){
        const user = await this.model.findById(id)

        if (!user) {
            throw new Error("El usuario no existe")
        }

        await this.model.deleteOne({ _id: id}, user)

        return true
    }

    async deleteUsersByInactivity(){
        await this.model.deleteMany({inactivity: true})
    }

    async uploadDocuments(id, body) {
        const user = await this.getUserById(id)

        if (!user) {
            throw new Error("El usuario no existe")
        }

        const status = "ready"

        const update = {
            status: status,
            documents: body
        }

        await this.model.updateOne({ _id: id}, update)

        return update
    }

    async uploadProfileImage(id, body){
        const user = await this.getUserById(id)

        if (!user) {
            throw new Error("El usuario no existe")
        }

        const update = {
            image: body.image
        }

        await this.model.updateOne({ _id: id}, update)

        return update
    }

    async getUserByIdWithRol(id){
        return this.model.findById(id)
    }
}

module.exports = DBUserManager