const { Schema, model, default: mongoose } = require("mongoose")

const userSchema = Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    typeCount: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    },
    rol: String,
    provider: String,
    access_token: String
})

module.exports = model("users", userSchema)