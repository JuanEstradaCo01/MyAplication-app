const DBProductManager = require("../DBProductManager")//DAO
const ProductRepository = require("./ProductsRepository")

const dbProductManager = new DBProductManager()
const productRepository = new ProductRepository(dbProductManager)

module.exports = productRepository