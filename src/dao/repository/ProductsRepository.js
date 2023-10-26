const ProductDto = require("../DTOs/productDto")
const DBProductManager = require("../DBProductManager")
const productsDAOFactory = require("../../factories/productsDAOFactory")

class ProductRepository {
    constructor() {
        this.dao = productsDAOFactory(process.env.STORAGE)
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