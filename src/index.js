const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const { generateMessage, generateLocationMessage }= require('./utils/messages')

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

    // socket.emit('message', {
    //     text: 'Welcome!',
    //     createdAt: new Date().getTime()
    // }) 
    socket.emit('message', generateMessage('Welcome!')) 
    socket.broadcast.emit('message', generateMessage('A new user has joined')) 

    socket.on('sendMessage', (message, callback)=>{
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }
        
        io.emit('message', generateMessage(message)) 
        // callback('Delivered your msg')
        callback() // this callback does nothing
    })

    socket.on('sendLocation', (coords, callback)=>{
        // io.emit('message', `Location: ${coords.latitude},${coords.longitude}`)
        // io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', ()=>{ 
        io.emit('message', generateMessage('A user has left')) 
    })

})

server.listen(port, ()=>{
    console.log(`Server is up on port ${port}!`)
})
