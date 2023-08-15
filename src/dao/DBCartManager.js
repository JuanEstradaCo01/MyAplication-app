const cartModel = require("./models/cartsModels");
const DBProductManager = require("./DBProductManager")
const dbproductManager = new DBProductManager()

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
            }]
        })
    }

    async deleteProductInCart(pid) {
        const productoEliminadoDelCarrito = await dbproductManager.getProductById(pid)
        console.log({productoEliminadoDelCarrito})

        if (!productoEliminadoDelCarrito) {
            throw new Error("El producto no existe")
        }

        await this.model.deleteOne({ product: pid})

        return true
    }

}

module.exports = DBCartManager