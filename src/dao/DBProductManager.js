const productModel = require("./models/productsModels")

class DBProductManager {
    constructor() {
        this.model = productModel
    }

    getProducts() {
        return this.model.find()
    }

    getProductById(id) {
        return this.model.findById(id)
    }

    addProduct(body) {
        return this.model.create({
            tittle: body.tittle,
            description: body.description,
            price: body.price,
            thumbnail: body.thumbnail,
            code: body.code,
            status: body.status,
            stock: body.stock,
            category: body.category
        })
    }

    async updateProduct(id, body) {
        const product = await this.getProductById(id)

        if (!product) {
            throw new Error("El producto no existe")
        }

        
        const update = {
            _id: product._id,
            tittle: body.tittle || product.tittle,
            description: body.description || product.description,
            price: body.price || product.price,
            thumbnail: body.thumbnail || product.thumbnail,
            code: body.code || product.code,
            status: body.status || product.status,
            stock: body.stock || product. stock,
            category: body.category || product.category
        }

        await this.model.updateOne({ _id: id}, update)

        return update
    }

    async deleteProduct(id) {
        const product = await this.model.findById(id)

        if (!product) {
            throw new Error("El producto no existe")
        }

        await this.model.deleteOne({ _id: id})

        return true
    }
}

module.exports = DBProductManager

