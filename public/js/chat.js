//! Client-side Javascript Code

const socket = io()

//! server (emit) -> client (recieve) --acknowledgement--> server
//! client (emit) -> server (recieve) --acknowledgement--> client

socket.on('message', (message)=>{
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault() // to prevent page from refreshing after submission of form

    // const message = document.querySelector('input').value
    const message = e.target.elements.message.value //! This is alternative of the above line

    //! here the 3rd parameter i.e the function runs for acknowledgement
    socket.emit('sendMessage', message, (error)=>{
        // console.log('The message was delivered!')
        if (error) {
            return console.log(error)
        }

        console.log('Message delivered')

    })
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
        }, ()=>{
            console.log('Location shared')
        })
    })
})

//! Goal: Setup acknowledgement

//1. Setup the client acknowledgement function
//2. Setup the server to send back the acknowledgement
//3. have the client print "Location shared!" when acknowledged
//4. Test your work