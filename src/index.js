const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

//!Example -
//! server (emit) -> client (recieve) - countUpdated
//! client (emit) -> server (recieve) - increment

//! Server-side Javascript Code


io.on('connection',(socket)=>{
    console.log('New WebSocket connection')

    socket.emit('message','Welcome!') // emits to everybody
    socket.broadcast.emit('message', 'A new user has joined') // emits to everybody but not to the current user

    socket.on('sendMessage', (message, callback)=>{ // allows the server to listen for an event and respond to it
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }
        
        io.emit('message', message) // emits that message from server to all users
        // callback('Delivered your msg')
        callback() // this callback does nothing
    })

    socket.on('sendLocation', (coords, callback)=>{
        // io.emit('message', `Location: ${coords.latitude},${coords.longitude}`)
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })

    socket.on('disconnect', ()=>{ // socket.io's inbuild feature => disconnect
        io.emit('message', 'A user has left') // emits this message to all users
    })

})

server.listen(port, ()=>{
    console.log(`Server is up on port ${port}!`)
})
