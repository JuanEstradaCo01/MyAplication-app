const express = require("express")
const passport = require("passport")
const userModel = require("../dao/models/userModel")
const productsmodels = require("../dao/models/productsModels")
const {createHash, isValidPassword} = require("../utils/passwordHash")
const {generateToken} = require("../utils/jwt")
const DBProductManager = require("../dao/DBProductManager")
const dbproductManager = new DBProductManager() //Para usar mongo

const BaseRouter = require("./BaseRouter")

const sessionRouter = express.Router()

const passportCall = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) {
        return next(err)
      }

      if (!user) {
        return res.status(401).json({
          error: info.messages ? info.messages : info.toString()
        })
      }

      req.user = user

      return next()
    })(req, res, next)
  }
}

class SessionRouter extends BaseRouter {
  init() {
    this.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => { 


    })
    
    this.get("/github-callback", passport.authenticate("github", {failureRedirect: "/login"}), async (req, res) => { 
    
      const username = req.user.username
      const lastname = req.user.lastname
      const email = req.user.email
      const age = req.user.age
      const rol = req.user.rol
      const provider = req.user.provider
      return res.render("profileGitHub", {username, lastname, email, age, rol, provider})
    })
    
    this.get("/", ( req, res) => {
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
    
    this.post("/register", 
      passport.authenticate("register", {failureRedirect: "/register", failureFlash: true}), 
      async (req, res) => {
        //Hasheo la contraseña
        /*const body = req.body
        body.password = createHash(body.password)
    
        const user = await userModel.create(body)
        const usuarioCreado = user
        console.log({usuarioCreado})*/
        
         
        //JWT:
        const nuevoUsuario = req.body
    
        const token = generateToken({
          username: nuevoUsuario.username,
          email: nuevoUsuario.email
        })
    
        nuevoUsuario.access_token = token
    
        console.log({nuevoUsuario})
    
        //return res.status(201).json({ ...nuevoUsuario, access_token: token})
        return res.redirect("/login") //Respuesta de redireccion
        //return res.status(201).json(req.user) //Respuesta de api(JSON)
    })
    
    this.post("/login", 
      passport.authenticate("login",{failureRedirect:"/login", failureFlash: true}) ,(req, res, next) => {
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
    

        //Pagino los productos
        const products = await productsmodels.paginate({  }, {limit, page})
    
        products.docs = products.docs.map(user => user.toObject())
    
        //Valido el correo registrado para saber si es admin o no ya que el valor es unico
        if (user.email === "adminCoder@coder.com") {
          user.rol = "Admin"
        }else{
          user.rol = "User"
        }
    
        //Genero token:
        const token = generateToken({
          first_name: req.user.first_name,
          email: req.user.email,
          rol: req.user.rol,
          cart: req.user.cart
        })
        user.access_token = token
    
        //Valido si el usuario es admin:(Respuestas de Admin)
        if (user.rol === "Admin"){
          return res.cookie(`Token`, token, {maxAge: 60 * 60 * 1000}).render("products", {products, user})//Renderizado a perfil de Admin
          //return res.status(200).json(req.user)//Respuesta de JSON
          //return res.cookie(`Token`, token, {maxAge: 60 * 60 * 1000}).redirect("/api/sessions/current")//Redireccion a current
          //return res.redirect("/products")//Redireccion a perfil de admin
        }
    
        //(Respuestas de User):
        //return res.cookie(`Token`, token, {maxAge: 60 * 60 * 1000}).redirect("/api/sessions/current")//Redireccion a current
        return res.cookie(`Token`, token, {maxAge: 60 * 60 * 1000}).render("profile",{products, user})//Renderizado a perfil de User
        //return res.redirect("/profile")//Redireccion a perfil de User
        //return res.status(200).json(req.user)//Respuesta de JSON
    })
    
    this.post("/logout", (req, res) => {
      req.session.destroy(e => {
        if (!e) {
        return res.redirect("/login")
        }
      
        return res.render("login")
    })
    })
    
    this.post("/recovery", async (req, res) => {
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
    
    this.get("/failregister", (req, res) => {
      return res.json({
        error: "Error al registrarse"
      })
    })
    
    this.get("/faillogin", (req, res) => {
      return res.json({
        error: "Error al iniciar sesion"
      })
    })
    
    this.get("/current", passportCall("jwt"), (req, res) => {
      const user = req.user

      //Usuario solo con los datos que quiero mostrar
      const userToSend = {
        name: user.first_name,
        email: user.email,
        rol: user.rol
      }

      return res.send(userToSend)
    })
  }
}
module.exports = SessionRouter