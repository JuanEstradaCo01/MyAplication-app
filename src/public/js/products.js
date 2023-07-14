const socket = io()

console.log(socket)


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
