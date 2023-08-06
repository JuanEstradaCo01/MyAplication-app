const { Router } = require("express")
const DBMessagesManager = require("../dao/DBMessagesManager")
const dbmessagesmanager = new DBMessagesManager()



const viewsRouterFn = (io) => {

    const viewsRouter = new Router()

    const users = []


    viewsRouter.get("/login", (req, res) => {
        return res.render("login")
    })


    viewsRouter.post("/login", (req, res) => {
        const user = req.body

        const username = user.nombre

        users.push(username)

        //io.emit("newUser", username)

        console.log(users)

        return res.redirect(`/chat?username=${username}`)
    })


    viewsRouter.get("/chat", (req, res) => {

        

        return res.render("index")
    })


    

    return viewsRouter
}



module.exports = viewsRouterFn