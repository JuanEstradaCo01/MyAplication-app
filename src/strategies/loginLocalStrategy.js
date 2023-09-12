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
            
            //Si no existe carrito al iniciar sesion creo uno:
            const nombre = user.first_name
            if(!user.cart){
                const newCart = await cartsModels.create({
                    name: `Carrito de ${nombre}`
                })

                await userModel.updateOne({_id: user._id}, {cart: newCart._id})
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