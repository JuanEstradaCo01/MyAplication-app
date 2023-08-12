const mongoose = require("mongoose")
const productsmodels = require("./dao/models/productsModels")

const MONGODB_CONNECT = "mongodb+srv://jp010:pasnWqeVnYjKv10W@cluster001.lv2pfsi.mongodb.net/ecommerce?retryWrites=true&w=majority"

;(async () => {
    await mongoose.connect(MONGODB_CONNECT)

    const products = await productsmodels.paginate({ }, { limit: 8, page: 1 })

    console.log(products)
})()