class ProductDto {
    constructor(product) {
        this.id = product.id
        this.tittle = product.tittle.toUpperCase()
        this.description = product.description
        this.price = product.price
        this.thumbnail = product.thumbnail
        this.code = product.code
        this.status = product.status
        this.stock = product.stock
        this.category = product.category
        this.owner = product.owner
    }
}

module.exports = ProductDto