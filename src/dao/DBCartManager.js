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
            name: body.name,
            products: []
        })
    }

    async addProductToCart(cid, cart) {
        return this.model.updateOne({_id: cid}, cart)
    }

    async deleteProductInCart(pid, cart) {

        const carrito = cart

        await this.model.deleteOne({ _id: pid}, carrito)

        return true
    }

    async updateCart(cid, cart) {
        const carrito = await this.getCartById(cid)

        if (!carrito) {
            throw new Error("El carrito no existe")
        }

        const update = {
            _id: carrito._id,
            name: cart.name || carrito.name,
            products: cart.products
        }

        await this.model.updateOne({ _id: cid}, update)
        return update
    }

    async updateQuantity(cid) {
        const cart = await this.getCartById(cid)

        if (!cart) {
            throw new Error("El carrito no existe")
        }

        const update = {
            name: cart.name,
            products: [{
                product: cart.product,
                quantity: cart.quantity
            }]
        }

        await this.model.updateOne({ _id: cid}, update)

        return update
    }
    
    async deleteCart (cid) {
        const carritoEliminado = await this.getCartById(cid)

        if (!carritoEliminado) {
            throw new Error("El carrito no existe")
        }

        await this.model.deleteOne({ _id: cid})
        
        return true
    }

}

module.exports = DBCartManager