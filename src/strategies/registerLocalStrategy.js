const passportLocal = require("passport-local")
const LocalStrategy = passportLocal.Strategy
const passportJWT = require('passport-jwt')
const userModel = require("../dao/models/userModel")
const { createHash, isValidPassword } = require("../utils/passwordHash")

const registerLocalStrategy = new LocalStrategy(
    {passReqToCallback: true, usernameField: "email"},
    async (req, first_name, password, done) => {
        try {
            const user = await userModel.findOne({email: first_name})

            if(user) {
                console.log("Ya hay un usuario registrado con este correo electronico")
                return done(null, false, { message: "Ya existe un usuario registrado con este correo electronico" })
            }

            const body = req.body
            body.password = createHash(body.password)

            const newUser = await userModel.create(body)
            console.log({newUser})


            return done(null, newUser)

        }catch(e){
            return done(e)
        }
    }
)

module.exports = registerLocalStrategy