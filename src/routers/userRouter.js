const express = require("express")
const UserManager = require("../dao/DBUserManager")
const usermanager = new UserManager()
const {generateToken} = require("../utils/jwt")


const userRouter = express()

userRouter.get("/", async (req, res) => {
    const users = await usermanager.getUsers()
    return res.status(200).json(users)
})

userRouter.get("/:uid", async (req, res) => {
    const uid = req.params.uid
    const user = await usermanager.getUserById(uid)
    return res.status(200).json(user)
})

module.exports = userRouter