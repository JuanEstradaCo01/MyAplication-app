const express = require("express")
const UserManager = require("../dao/DBUserManager")
const usermanager = new UserManager()
const {generateToken} = require("../utils/jwt")


const userRouter = express()

userRouter.get("/", async (req, res) => {
    const users = await usermanager.getUsers()
    return res.status(200).json(users)
})

//Endpoint para cambiar dinamicamente el rol por params:
userRouter.get("/:rol/:uid", async (req, res) => {
    try{
        const id = req.params.uid
        const rols = req.params.rol

        const user = await usermanager.getUserById(id)
        if(!user){
            return res.status(404).json({notFound: "El usuario no existe en la base de datos"}).req.logger.error("El usuario no existe en la base de datos")
        }
        user.typeCount = rols

        const first_name = user.first_name
        const last_name = user.last_name
        const email = user.email
        const age = user.age
        const rol = user.typeCount

        //return res.status(200).json({user})
        return res.render("profileParams", {first_name, last_name, email, age, rol})
    }catch(e){
        return res.json({error: "Ha ocurrido un error inesperado"}).req.logger.error("Ha ocurrido un error inesperado")
    }
})

module.exports = userRouter