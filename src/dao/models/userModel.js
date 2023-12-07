const { Schema, model, default: mongoose } = require("mongoose")

const userSchema = Schema({
    image: String,
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    typeCount: String,
    date: String,
    expiratedLink: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    },
    rol: String,
    provider: String,
    access_token: String,
    status: {
        type: String,
        default: "empty"
    },
    documents: {
        type: [{
            name: String,  //Nombre del documento
            reference: String  //Link del documento
        }]
    },
    last_connection: String,
    inactivity: String,
    deleteByInactivity: {
        type: String,
        default: false
    }
})

module.exports = model("users", userSchema)