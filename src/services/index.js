const DBProductManager = require("../dao/DBProductManager")//DAO
const ProductRepository = require("../dao/repository/ProductsRepository")

const dbProductManager = new DBProductManager()
const productRepository = new ProductRepository(dbProductManager)

module.exports = productRepository