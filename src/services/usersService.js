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

    uploadDocuments(id, body){
        return this.storage.uploadDocuments(id, body)
    }

    uploadProfileImage(id, body){
        return this.storage.uploadProfileImage(id, body)
    }
}

module.exports = UsersService