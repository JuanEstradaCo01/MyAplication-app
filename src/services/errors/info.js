const generateProductErrorInfo = (product) => {
    return `
    Una o mas de las siguientes propiedades son incorrectas:
      - id: Debe ser tipo Number, se recibio: ${product.id}
      - tittle: Debe ser tipo String, se recibio: ${product.tittle}
      - description: Debe ser tipo String, se recibio: ${product.description}
      - price: Debe ser tipo Number, se recibio: ${product.price}
      - thumbnail: Debe ser tipo String, se recibio: ${product.thumbnail}
      - code: Debe ser tipo String, se recibio: ${product.code}
      - status: Debe ser tipo Boolean, se recibio: ${product.status}
      - stock: Debe ser tipo Number, se recibio: ${product.stock}
      - category: Debe ser tipo String, se recibio: ${product.category}
    `
}

module.exports = generateProductErrorInfo