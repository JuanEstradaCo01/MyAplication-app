const {faker} = require("@faker-js/faker")

const saveProducts = () => {
    let products = []

    for(let i= 0; i < 100; i++) {
        products.push(generateProduct())
    }

    return{
        products
    }
}

const generateProduct = () => {
    return{
        id: faker.database.mongodbObjectId(),
        tittle: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 100, max: 200, dec: 0, symbol: '$' }),
        thumbnail: faker.image.avatar(),
        code: faker.commerce.isbn(),
        status: faker.datatype.boolean(0.9),
        stock: faker.commerce.price({ min: 1, max: 1000, dec: 0 }),
        category: faker.commerce.productMaterial()
    }
}

module.exports = saveProducts