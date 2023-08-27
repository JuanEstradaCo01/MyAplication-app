const express = require("express")

const { Router } = express

const viewsRouter = new Router()

const products = require("../managerDB.json")

const productsmodels = require("../dao/models/productsModels")

const sessionMidleware = (req, res, next) => {
    if (req.session.usuario) {
        return res.redirect("/profile")
    }

    return next()
}

viewsRouter.get("/prod", (req, res) => {

    const params = {
        titulo: "Productos",
        products
    }
    return res.render("home", params)
})

viewsRouter.get("/realtimeproducts", (req, res) => {

    const params = {
        titulo: "Productos",
        products
    }
    return res.render("realTimeProducts", params)
})

viewsRouter.get("/register", sessionMidleware, (req, res) => {
    return res.render("register")
})

viewsRouter.get("/login", sessionMidleware, (req, res) => {
    return res.render("login")
})

viewsRouter.get("/recovery", sessionMidleware, (req, res) => {
    return res.render("recovery")
})

viewsRouter.get("/products", (req, res, next) => {
    if (!req.session.usuario) {
        return res.redirect("/login")
    }

    return next()
}, async (req, res) => {
    const user = req.session.usuario
    const limit = 50 //req.query.limit || 10
    const page = req.query.page || 1


    //Pagino los productos en la vista "/products"
    const products = await productsmodels.paginate({  }, {limit, page})

    products.docs = products.docs.map(user => user.toObject())

    //Valido el correo registrado para saber si es admin o no ya que el valor es unico
    if (user.email === "adminCoder@coder.com") {
        user.admin = true
    }else{
        user.admin = "Rol: (Usuario)"
    }

    //Valido si el usuario es admin le muestro la lista de productos y si no es admin no le muestro los productos
    if (user.admin === true){
        return res.render("products", {products, user})
    }
    
    return res.render("profile", {user} )
    
})

viewsRouter.get("/recoverysuccess", (req, res) => {
    return res.render("recoverysuccess")
})

viewsRouter.get("/logout",  (req, res) => {
    return res.redirect("login")
})

module.exports = viewsRouter