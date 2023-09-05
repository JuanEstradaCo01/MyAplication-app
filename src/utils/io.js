const { Server } = require("socket.io")


const init = (httpServer) => {

    const io = new Server(httpServer)

    /*io.on("connection", (socket) => {
        console.log("Nuevo cliente conectado", socket.id)

    })*/

    return io

}

module.exports = init
