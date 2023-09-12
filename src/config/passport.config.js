const passport = require("passport")
const passportLocal = require("passport-local")
const userModel = require("../dao/models/userModel")
const gitHubStrategy = require("../strategies/gitHubStrategy")
const registerLocalStrategy = require("../strategies/registerLocalStrategy")
const loginLocalStrategy = require("../strategies/loginLocalStrategy")
const JWTstrategy = require("../strategies/JWTStrategy")
const { generateToken } = require("../utils/jwt")

const initializePassport = () => {
    
    passport.use("jwt", JWTstrategy)

    passport.use("github", gitHubStrategy)

    passport.use("register", registerLocalStrategy)

    passport.use("login", loginLocalStrategy)

    passport.serializeUser((user, done) => {
        console.log("serializeUser")
        done(null, user._id)
    })

    passport.deserializeUser( async (id, done) => {
        console.log("deserializeUser")
        const user = await userModel.findOne({_id: id}).populate("cart")

        //let user = await userModel.findOne({_id: id})

/*      //JWT:
        const token = generateToken(user)
        user = user.toObject()
        user.access_token = token
        console.log({user})
*/
        done(null, user)
    })
}

module.exports = initializePassport