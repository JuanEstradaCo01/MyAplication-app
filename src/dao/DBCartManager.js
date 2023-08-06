const cartModel = require("./models/cartsModels");

class DBCartManager {
    constructor() {
        this.model = cartModel
    }

    async getCarts() {
        return this.model.find()
    }

    async getCartById(id) {
        return this.model.findById(id)
    }

    async addCart(body) {
        return this.model.create({
            carrito: body.carrito,
            products: []
        })
    }

    async addProductToCart(body) {
        return this.model.create({
            carrito: body.carrito,
            products: [{ 
                product: body.product, 
                quantity: body.quantity
        }]})
    }

}

module.exports = DBCartManager