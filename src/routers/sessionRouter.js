const express = require("express")
const passport = require("passport")
const userModel = require("../dao/models/userModel")
const productsmodels = require("../dao/models/productsModels")
const {createHash, isValidPassword} = require("../utils/passwordHash")


const sessionRouter = express.Router()

sessionRouter.get("/github", passport.authenticate("github", {scope: ["email: email"]}), async (req, res) => { })

sessionRouter.get("/github-callback", passport.authenticate("github", {failureRedirect: "/login"}), (req, res, next) => {
  if (!req.user) {
      return res.redirect("/login")
  }

  return next()
}, async (req, res) => { 
  const user = req.user
  
  return res.render("profile", {user})
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

    return res.status(201).redirect("/login") //Respuesta de redireccion
    //return res.status(201).json(req.user) //Respuesta de api(JSON)
}
)

sessionRouter.post("/login", 
  passport.authenticate("login",{failureRedirect: "/faillogin"}), (req, res, next) => {
    if (!req.user) {
        return res.redirect("/login")
    }

    return next()
} ,async(req, res) => {
    /*let user = await userModel.findOne({username: req.body.login})

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


    req.session.usuario = user*/

    const user = req.user
    const limit = 50 //req.query.limit || 10
    const page = req.query.page || 1

    user.provider = "Local"

    //Pagino los productos en la vista "/products"
    const products = await productsmodels.paginate({  }, {limit, page})

    products.docs = products.docs.map(user => user.toObject())

    //Valido el correo registrado para saber si es admin o no ya que el valor es unico
    if (user.email === "adminCoder@coder.com") {
        user.admin = "true"
    }else{
        user.admin = "Rol: (Usuario)"
    }

    //Valido si el usuario es admin le muestro la lista de productos y si no es admin no le muestro los productos
    if (user.admin === "true"){
      return res.render("products", {products, user})
    }


    return res.render("profile",{user})
    console.log({
      user: req.user,
      session: req.session
    })

    return res.redirect("/products")

    //return res.json(req.user)
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

module.exports = sessionRouter