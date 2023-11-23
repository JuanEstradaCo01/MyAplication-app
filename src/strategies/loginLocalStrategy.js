const passportLocal = require("passport-local")
const LocalStrategy = passportLocal.Strategy
const userModel = require("../dao/models/userModel")
const cartsModels = require("../dao/models/cartsModels")
const { createHash, isValidPassword } = require("../utils/passwordHash")

const loginLocalStrategy = new LocalStrategy(
    {usernameField: "email"},
    async (email, password, done) => {
        try{
            let user = await userModel.findOne({email: email}).populate("cart")

            if (!user) {
                console.log("El usuario no existe")
                return done(null, false, { message: "El usuario no existe" })
            }

            if(!isValidPassword(password, user.password)){
                console.log("Contraseña incorrecta")
                return done(null, false, { message: "Contraseña incorrecta" })
            }

            //Eliminar contraseña
            user = user.toObject()
            delete user.password

            done(null, user)

        }catch(e){
            return done(e)
        }
    }
)

module.exports = loginLocalStrategy