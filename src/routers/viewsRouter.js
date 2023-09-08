const express = require("express")
const { Router } = express
const viewsRouter = new Router()

const products = require("../managerDB.json")
const { verifyToken } = require("../utils/jwt")


const sessionMidleware = (req, res, next) => {
    if (req.session.usuario) {
        return res.redirect("/profile")
    }

    return next()
}

const authMidleware = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.replace("Bearer", "")

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
    return res.render("register")
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
viewsRouter.get("/products" , async (req, res) => {
    return res.render("products")
})

viewsRouter.get("/profile", authMidleware, (req, res) => {
    return res.json(req.user)
    //return res.render("profile", user)
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