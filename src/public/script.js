/* para JWT
const loginUser = document.getElementById("loginUser")
const loginPassword = document.getElementById("loginPassword")
const loginBtn = document.getElementById("loginBtn")

loginBtn.addEventListener("click", (e) => {

    //e.preventDefault()
    const email = loginUser.value
    const password = loginPassword.value

    fetch('http://localhost:8080/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
      .then(result => result.json())
      .then(data => {
        console.log(data)
        localStorage.setItem("Token", data.access_token)
    })
})
*/