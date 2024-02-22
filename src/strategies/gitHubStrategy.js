const GitHubStrategy = require("passport-github2")
const userModel = require("../dao/models/userModel")

const gitHubStrategy = new GitHubStrategy({
    clientID: `Iv1.45aff0769d29e7de`,
    clientSecret: `4dad4b5305419b28cc3f6347a53fa910081861dd`,
    callbackURL: `${process.env.URL_RAILWAY}/api/sessions/github-callback`
    //${process.env.URL_RAILWAY}
    //http://localhost:8080
}, async (accessToken, refreshToken, profile, done) => {

    try{
        let user = await userModel.findOne({first_name: profile._json.login})


        if(user) {
            console.log("El usuario ya existe en la base de datos")
            return done(null, user)
        }

        const newUser = await userModel.create({
            first_name: profile.name || profile._json.login,
            last_name: profile._json.login,
            email: profile._json.email || `${profile._json.login}@email.com`,
            age: 30, //profile._json.name,
            typeCount: "User",
            provider: profile.provider,
            date: new Date().toLocaleString(),
            expiratedLink: ""
        })

        return done(null, newUser)
    }catch(e){
        return done(e)
    }
})

module.exports = gitHubStrategy