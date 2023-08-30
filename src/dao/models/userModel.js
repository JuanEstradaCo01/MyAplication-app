const { Schema, model } = require("mongoose")

const userSchema = Schema({
    username: String,
    lastname: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    rol: String,
    provider: String
})

module.exports = model("users", userSchema)