const socket = io()

console.log(socket)

const tittleInput = document.getElementById("tittle")
const descriptionIpunt = document.getElementById("description")
const thumbnailInput = document.getElementById("thumbnail")
const priceInput = document.getElementById("price")
const codeInput = document.getElementById("code")
const statusInput = document.getElementById("status")
const stockInput = document.getElementById("stock")
const categoryInput = document.getElementById("category")
const formButton = document.getElementById("formButton")

formButton.addEventListener("submit", (evt) => {
    evt.preventDefault()

    const nombre = tittleInput.value
    const descripcion = descriptionIpunt.value
    const imagen = thumbnailInput.value
    const precio = priceInput.value
    const codigo = codeInput.value
    const estado = statusInput.value
    const stock = stockInput.value
    const categoria = categoryInput.value

    console.log({nombre,precio,codigo,stock,categoria})

    fetch("/realtimeproducts", {
        method: "POST",
        body: {nombre,precio,stock,categoria}
    })
})



socket.on("NuevoProducto", (data) => {
    const product = JSON.parse(data)

    const produc= `
    <tr>
        <td>${product.id}</td>
        <td>${product.tittle}</td>
        <td>${product.price}</td>
        <td>${product.stock}</td>
        <td>${product.category}</td>
        <td>${product.code}</td>
    </tr>
    `

    const producthtml = document.createElement("tr")
    producthtml.innerHTML = produc
    

    const table = document.getElementById("productos")

    table.append(producthtml)
})
