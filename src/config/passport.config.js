const passport = require("passport")
const passportLocal = require("passport-local")
const userModel = require("../dao/models/userModel")
const gitHubStrategy = require("../strategies/gitHubStrategy")
const registerLocalStrategy = require("../strategies/registerLocalStrategy")
const loginLocalStrategy = require("../strategies/loginLocalStrategy")
const { generateToken } = require("../utils/jwt")

const initializePassport = () => {
    passport.use("github", gitHubStrategy)

    passport.use("register", registerLocalStrategy)

    passport.use("login", loginLocalStrategy)

    passport.serializeUser((user, done) => {
        console.log("serializeUser")
        done(null, user._id)
    })

    passport.deserializeUser( async (id, done) => {
        console.log("deserializeUser")
        let user = await userModel.findOne({_id: id})

        const token = generateToken(user)
        user = user.toObject()
        user.acces_token = token
        console.log({user})


        done(null, user)
    })
}

module.exports = initializePassport