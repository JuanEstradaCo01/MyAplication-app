const express = require("express")
const { Router } = express
const viewsRouter = new Router()
const products = require("../managerDB.json")
const { generateToken,verifyToken } = require("../utils/jwt")


const sessionMidleware = (req, res, next) => {
    if (req.session.usuario) {
        return res.redirect("/profile")
    }

    return next()
}

const authMidleware = async (req, res, next) => {
    const token = req.user.access_token//.replace("Bearer ", "")

    if(!token) {
        return res.status(401).json({error: "Token invalido"})
    }
    const payload = await verifyToken(token)
    req.user = payload.user

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

viewsRouter.get("/register", sessionMidleware, async (req, res) => {
    const error = req.flash("error")[0]
    return res.render("register", {
        error,
        hasError: error !== undefined
    })
})

viewsRouter.get("/login", sessionMidleware, (req, res) => {
    const error = req.flash("error")[0]
    return res.render("login", {
        error,
        hasError: error !== undefined
    })
})

viewsRouter.get("/recovery", sessionMidleware, (req, res) => {
    return res.render("recovery")
})

//Vista de admin
viewsRouter.get("/products",//authMidleware , 
async (req, res) => {
    const user = req.user
    console.log({user})

    const username = req.user.username
    const lastname = req.user.lastname
    const email = req.user.email
    const age = req.user.age
    const rol = "Admin"
    const provider = "Local"
     return res.render("products", {user, username, lastname, email, age, rol, provider})
})

viewsRouter.get("/profile", //authMidleware,
 (req, res) => {
    const user = req.user
    const token = generateToken(user)
    user.access_token = token
    
    const username = req.user.first_name
    const lastname = req.user.last_name
    const email = req.user.email
    const age = req.user.age
    const rol = "User"
    const provider = "Local"

    //return res.json(user)
    return res.render("profile", {user, username, lastname, email, age, rol, provider})
})

viewsRouter.get("/recoverysuccess", (req, res) => {
    return res.render("recoverysuccess")
})

viewsRouter.get("/logout",  (req, res) => {
    return res.redirect("login")
})

viewsRouter.get("/faillogin", (req, res) => {
    return res.json({error: "failLogin"})
})

module.exports = viewsRouter