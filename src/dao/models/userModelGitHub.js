const { Schema, model } = require("mongoose")

const userSchemas = Schema({
    name: String,
    lastname: String,
    username: {
        type: String,
        unique: true
    },
    admin: String,
    createAt: Date
})

module.exports = model("usersGithub", userSchemas)