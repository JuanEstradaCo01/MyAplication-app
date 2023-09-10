const passportLocal = require("passport-local")
const LocalStrategy = passportLocal.Strategy
const userModel = require("../dao/models/userModel")
const { createHash, isValidPassword } = require("../utils/passwordHash")

const registerLocalStrategy = new LocalStrategy(
    {passReqToCallback: true, usernameField: "email"},
    async (req, username, password, done) => {
        try {
            const user = await userModel.findOne({email: username})

            if(user) {
                console.log("Ya hay un usuario registrado con este correo electronico")
                return done(null, false, { message: "Ya existe un usuario registrado con este correo electronico" })
            }

            const body = req.body
            body.password = createHash(body.password)

            const newUser = await userModel.create(body)
            console.log({newUser})

            const users = await userModel.find()

            return done(null, newUser)

        }catch(e){
            return done(e)
        }
    }
)

module.exports = registerLocalStrategy