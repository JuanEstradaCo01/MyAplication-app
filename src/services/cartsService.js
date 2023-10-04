const DBCartManager = require("../dao/DBCartManager")


class CartsService {
    constructor() {
        this.storage = new DBCartManager()
    }

    getCarts() {
        return this.storage.getCarts()
    }

    getCartById(id) {
        return this.storage.getCartById(id)
    }

    addCart(body) {
        return this.storage.addCart(body)
    }

    addProductToCart(cid, body) {
        return this.storage.addProductToCart(cid, body)
    }

    deleteProductInCart(pid) {
        return this.storage.deleteProductInCart(pid)
    }

    updateCart(cid, body) {
        return this.storage.updateCart(cid, body)
    }

    updateQuantity(cid) {
        return this.storage.updateQuantity(cid)
    }

    deleteCart(cid) {
        return this.storage.deleteCart(cid)
    }
}

module.exports = CartsService