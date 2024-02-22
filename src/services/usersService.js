const DBUserManager = require("../dao/DBUserManager")

class UsersService {
    constructor(){
        this.storage = new DBUserManager()
    }

    getUsers(){
        return this.storage.getUsers()
    }
    
    getUserById(id){
        return this.storage.getUserById(id)
    }
    
    updateUser(id, body){
        return this.storage.updateUser(id, body)
    }

    updateRolUser(id, body){
        return this.storage.updateRolUser(id, body)
    }

    deleteUser(id){
        return this.storage.deleteUser(id)
    }

    deleteUsersByInactivity(){
        return this.storage.deleteUsersByInactivity()
    }

    uploadDocuments(id, body){
        return this.storage.uploadDocuments(id, body)
    }

    uploadProfileImage(id, body){
        return this.storage.uploadProfileImage(id, body)
    }

    getUserByIdWithRol(id){
        return this.storage.getUserByIdWithRol(id)
    }
}

module.exports = UsersService