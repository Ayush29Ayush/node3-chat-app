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

    socket.on('sendMessage', (message)=>{
        io.emit('message', message)
    })

    socket.on('disconnect', ()=>{
        io.emit('message', 'A user has left')
    })

})

server.listen(port, ()=>{
    console.log(`Server is up on port ${port}!`)
})
