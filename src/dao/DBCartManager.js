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

    async deleteProductInCart(pid) {
        const productoEliminadoDelCarrito = await dbproductManager.getProductById(pid)
        console.log({productoEliminadoDelCarrito})

        if (!productoEliminadoDelCarrito) {
            throw new Error("El producto no existe")
        }

        await this.model.deleteOne({ product: pid})

        return true
    }

    async updateCart(cid, cart) {
        const carrito = await this.getCartById(cid)
        console.log({cart})

        if (!carrito) {
            throw new Error("El carrito no existe")
        }

        try{
            const update = await this.model.updateOne({ _id: cid}, {cart})
            const updated = {cart}
            return update
        }catch(e){
            console.log(e)
            return null
        }
        
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
        console.log({carritoEliminado})

        if (!carritoEliminado) {
            throw new Error("El producto no existe")
        }

        await this.model.deleteOne({ _id: cid})
        
        return true
    }

}

module.exports = DBCartManager