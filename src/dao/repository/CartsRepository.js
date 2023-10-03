const CartDto = require("../DTOs/cartDto")

class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    getCarts = async () => {
        const products = await this.dao.getCarts()
        return products
    }

    addCart = async (newCart) => {
        const cartToAgregate = new CartDto(newCart)
        const cart = await this.dao.addCart(cartToAgregate)
        return cart
    }
}

module.exports = CartRepository