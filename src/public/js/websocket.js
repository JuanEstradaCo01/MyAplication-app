const socket = io()

console.log(socket)

socket.emit("Mi mensaje", "Primer mensaje enviado desde el cliente")

socket.on("Mensaje back", (data) => {
    console.log(data)
})