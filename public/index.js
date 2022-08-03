const socket = io()

const tabla = document.getElementById('contentTable')
const email = document.getElementById('email')
const inputMessage = document.getElementById('inputMessage')
const message = document.getElementById('message')
const btnSend = document.getElementById('enviar')
const scrollMessage = document.getElementById('scroll')


socket.on('contentTable', async () => {
    try {
        const response = await fetch('/productos/table')
        const data = await response.json()

        const productos = data
            .map(producto => {
                const p = `
                <tr class="align-middle">
                    <td>${producto.title}</td>
                    <td>${producto.price}</td>
                    <td><img src=${producto.url}></td>
                </tr>
        `
                return p
            })
            .join('')

        tabla.innerHTML = productos
    } catch (e) {
        throw new Error;
    }
})

socket.on('contentMessage', async () => {
    try {
        const response = await fetch('/chat')
        const data = await response.json()
        const messages = data
            .map(msn => {
                const html = `
                    <p id="msnEmail">${msn.email} ${msn.time}  <span id="text">${msn.text}</span></p>
                `
                return html
            })
            .join('')

        message.innerHTML += messages
        scrollMessage.scrollTo(0, scrollMessage.scrollHeight)
    } catch (e) {
        throw new Error;
    }



})

socket.on('message', data => {
    const html = `
        <p id="msnEmail">${data.email} ${data.time}  <span id="text">${data.text}</span></p>
        
    `
    message.innerHTML += html
    scrollMessage.scrollTo(0, scrollMessage.scrollHeight)
})


const emit = () => {
    emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

    if (emailRegex.test(email.value)) {
        const data = {
            email: email.value,
            text: inputMessage.value
        }
        socket.emit('inputMessage', data)
        console.log(data)
        inputMessage.value = ''
    }
}

btnSend.addEventListener('click', emit)

inputMessage.addEventListener('keydown', event => {
    if (event.key === 'Enter') emit()
})
