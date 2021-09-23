//! Client-side Javascript Code

const socket = io()

socket.on('message', (message)=>{
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault() // to prevent page from refreshing after submission of form

    // const message = document.querySelector('input').value
    const message = e.target.elements.message.value //! This is alternative of the above line

    socket.emit('sendMessage', message)
})
