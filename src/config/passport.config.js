const passport = require("passport")
const passportLocal = require("passport-local")
const userModel = require("../dao/models/userModel")
const userGitHubSchema = require("../dao/models/userModelGitHub")
const GitHubStrategy = require("passport-github2")
const { createHash, isValidPassword } = require("../utils/passwordHash")

const LocalStrategy = passportLocal.Strategy

const initializePassport = () => {
    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.45aff0769d29e7de",
        clientSecret: "8322bbd99aab84ce08f9e92bc88e1086fa7ebba9",
        callbackURL: "http://localhost:8080/api/sessions/github-callback"
    }, async (accessToken, refreshToken, profile, done) => {

        try{
            const user = await userGitHubSchema.findOne({username: profile._json.login})
    
            if(user) {
                console.log("El usuario ya existe")
                return done(null, user)
            }
    
            const newUser = await userGitHubSchema.create({
                username: profile._json.login,
                admin: profile._json.type
            })
            console.log({newUser})
    
            return done(null, newUser)
        }catch(e){
            return done(e)
        }
    }))

    passport.use("register", new LocalStrategy(
        {passReqToCallback: true, usernameField: "email"},
        async (req, username, password, done) => {
            try {
                const user = await userModel.findOne({email: username})
    
                if(user) {
                    console.log("El usuario ya existe")
                    return done(null, false)
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
    ))

    passport.use("login", new LocalStrategy(
        {usernameField: "login"},
        async (email, password, done) => {
            try{
                let user = await userModel.findOne({email: email})

                if (!user) {
                    console.log("El usuario no existe")
                    return done(null, false)
                }

                if(!isValidPassword(password, user.password)){
                    console.log("Datos incorrectos")
                    return done(null, false)
                }

                user = user.toObject()
                delete user.password

                done(null, user)

            }catch(e){
                return done(e)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        console.log({user})
        console.log("serializeUser")
        done(null, user._id)
    })

    passport.deserializeUser( async (id, done) => {
        console.log("deserializeUser")
        const user = await userModel.findOne({_id: id})
        done(null, user)
    })
}

module.exports = initializePassport