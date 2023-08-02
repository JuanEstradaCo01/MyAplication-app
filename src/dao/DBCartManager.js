const cartModel = require("./models/cartsModels");

class DBCartManager {
    constructor() {
        this.model = cartModel
    }

    getCarts() {
        return this.model.find()
    }

    getCartById(id) {
        return this.model.findById(id)
    }

    addCart() {

    }

}

module.exports = DBCartManager