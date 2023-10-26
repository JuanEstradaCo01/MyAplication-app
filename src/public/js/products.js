const socket = io()

console.log(socket)

const id = 50
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

    const id = id.value
    const tittle = tittleInput.value
    const description = descriptionIpunt.value
    const thumbnail = thumbnailInput.value
    const price = priceInput.value
    const code = codeInput.value
    const status = statusInput.value
    const stock = stockInput.value
    const category = categoryInput.value

    fetch("/api/products", {
        method: "POST",
        body: {id,tittle,description,price,thumbnail,code,status,stock,category}
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
