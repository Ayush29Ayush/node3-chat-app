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


io.on('connection',(socket)=>{
    console.log('New WebSocket connection')

    socket.emit('message','Welcome!') // emits to everybody
    socket.broadcast.emit('message', 'A new user has joined') // emits to everybody but not to the current user

    socket.on('sendMessage', (message)=>{ // allows the server to listen for an event and respond to it
        io.emit('message', message) // emits that message from server to all users
    })

    socket.on('sendLocation', (coords)=>{
        // io.emit('message', `Location: ${coords.latitude},${coords.longitude}`)
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    })

    socket.on('disconnect', ()=>{ // socket.io's inbuild feature => disconnect
        io.emit('message', 'A user has left') // emits this message to all users
    })

})

server.listen(port, ()=>{
    console.log(`Server is up on port ${port}!`)
})
