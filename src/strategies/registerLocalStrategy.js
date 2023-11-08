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
                req.logger.error("Ya existe un usuario registrado con este correo electronico")
                return done(null, false, { message: "Ya existe un usuario registrado con este correo electronico" })
            }

            const body = req.body
            body.date = new Date().toLocaleString()
            body.expiratedLink = ""
            body.password = createHash(body.password)

            //Autorizo si alguien no autorizado intenta crear una cuenta de admin:
            if(body.email != "adminCoder@coder.com" && body.typeCount === "Admin"){
                req.logger.error("No estas autorizado para crear una cuenta de Admin")
                return done(null, false, { message: "No estas autorizado para crear una cuenta de Admin"})
            }

            const newUser = await userModel.create(body)

            return done(null, newUser)

        }catch(e){
            return done(e)
        }
    }
)

module.exports = registerLocalStrategy