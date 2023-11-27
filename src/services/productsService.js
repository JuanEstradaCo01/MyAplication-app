const DBProductManager = require("../dao/DBProductManager")


class ProductsService {
    constructor() {
        this.storage = new DBProductManager()
    }

    getProducts() {
        return this.storage.getProducts()
    }

    getProductById(id) {
        return this.storage.getProductById(id)
    }

    addProduct(body) {
        return this.storage.addProduct(body)
    }

    updateProduct(id, body) {
        return this.storage.updateProduct(id, body)
    }

    deleteProduct(id) {
        return this.storage.deleteProduct(id)
    }

    updateProductImage(id, body){
        return this.storage.updateProductImage(id, body)
    }
}

module.exports = ProductsService