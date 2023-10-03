const ProductDto = require("../DTOs/productDto")

class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    getProducts = async () => {
        const products = await this.dao.getProducts()
        return products
    }

    addProduct = async (newProduct) => {
        const productToAgregate = new ProductDto(newProduct)
        const product = await this.dao.addProduct(productToAgregate)
        return product
    }
}

module.exports = ProductRepository