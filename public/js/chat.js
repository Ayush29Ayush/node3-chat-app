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

document.querySelector('#send-location').addEventListener('click', ()=>{
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        // console.log(position)
        socket.emit('sendLocation',{
            // these values are taken according to the chrome developer tools
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })
})

//! Goal: Share coordinates with other users
//1. Have client emit "sendLocation" with an object as the data
//   - Object should contain latitide and longitude properties
//2. Server should listen for "sendLocation"
//   - When fired, send a "message" to all connected clients "Location: lat, long"
//3. test your work!