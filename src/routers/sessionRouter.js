const express = require("express")
const passport = require("passport")
const userModel = require("../dao/models/userModel")
const {createHash, isValidPassword} = require("../utils/passwordHash")


const sessionRouter = express.Router()

sessionRouter.get("/github", passport.authenticate("github", {scope: ["username: login"]}), async (req, res) => {
  return res.redirect("/products")
})

sessionRouter.get("/github-callback", passport.authenticate("github", {failureRedirect: "/login"}) , async (req, res) => {
  return res.redirect("/products")
})

sessionRouter.get("/", ( req, res) => {
    return res.json(req.session)

    
    if (!req.session.counter) {
      req.session.counter= 1
      req.session.username = req.query.username
  
      return res.json(`Hola ${req.session.username}`)
    }else {
      req.session.counter++
  
      return res.json(`${req.session.username} has ingreado ${req.session.counter} veces`)
    }
  })


sessionRouter.post("/register", 
  passport.authenticate("register", {failureRedirect: "/failregister"}), 
  async (req, res) => {
    //Hasheo la contraseña
    /*const body = req.body
    body.password = createHash(body.password)

    const user = await userModel.create(body)
    const usuarioCreado = user
    console.log({usuarioCreado})*/

    return res.redirect("/login") //Respuesta de redireccion
    //return res.status(201).json(req.user) //Respuesta de api(JSON)
}
)

sessionRouter.get("/failregister", (req, res) => {
  return res.json({
    error: "Error al registrarse"
  })
})

sessionRouter.get("/faillogin", (req, res) => {
  return res.json({
    error: "Error al iniciar sesion"
  })
})

sessionRouter.post("/login", 
passport.authenticate("login",{failureRedirect: "/faillogin"}),
  async(req, res) => {
    let user = await userModel.findOne({username: req.body.login})

    if (!user) {
        return res.status(404).json({
            error: "No existe el usuario"
        })
    }

    if (!isValidPassword(req.body.password, user.password)) {
        return res.status(404).json({
            error: "(Datos incorrectos) Usuario y/o contraseña incorrecta"
        })
    }

    //Para no mostrar la contraseña 
    user = user.toObject()
    delete user.password


    req.session.usuario = user
    console.log({
      user: req.user,
      session: req.session
    })
    return res.redirect("/products")

    //return res.render("products")
})

sessionRouter.post("/logout", (req, res) => {
  req.session.destroy(e => {
    if (!e) {
    return res.redirect("/login")
    }
  
    return res.render("login")
})
})

sessionRouter.post("/recovery", async (req, res) => {
  let verificar = await userModel.findOne({email: req.body.email})

  if (!verificar) {
    return res.status(404).json({
        error: "No existe el usuario"
    })
  }

  const nuevaPassword = createHash(req.body.password)
  await userModel.updateOne({_id: verificar._id}, {password: nuevaPassword})

  return res.redirect("/recoverysuccess")
})

module.exports = sessionRouter