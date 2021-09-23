const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

//! server (emit) -> client (recieve) - countUpdated
//! client (emit) -> server (recieve) - increment

//! Server-side Javascript Code


//! Goal: Send a Welcome message to new users
//1. Have server emit "message" when new client connects
//   - Send "Welcome!" as the event data
//2. Have client listen for "message" event and print to console
//3. Test your work!

//! Goal: Allow clients to send messages
//1. Create a form with an input and button
//   - Similar to the weather form
//2. Setup event listener for form submission
//   - Emit "sendMessage" with input string as message data
//3. Have server listen for "sendMessage"
//   - Send message to all connected clients
//4. Test your work!

io.on('connection',(socket)=>{
    console.log('New WebSocket connection')

    socket.emit('message','Welcome!')

    socket.on('sendMessage', (message)=>{
        io.emit('message', message)
    })

})

server.listen(port, ()=>{
    console.log(`Server is up on port ${port}!`)
})
