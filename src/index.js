const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const { generateMessage, generateLocationMessage }= require('./utils/messages')
const { addUser,removeUser,getUser,getUsersInRoom } = require('./utils/users')

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

//! we've sent events from server to client using three methods =>
    //1. socket.emit -> sends event from server to a specific client
    //2. io.emit -> sends event to every connected client to the server
    //3. socket.broadcast.emit -> sends event to every connected client except for itself

//! Two new approaches what we will use now =>
    //1. io.to.emit -> it omits an event to everybody in a specific room so that's going to allow us to send a message to everyone in a room without sending it to people in other rooms
    //2. socket.broadcast.to.emit -> sends an event to everyone expect for a specific client, bit it's limiting to a specific chat room

io.on('connection',(socket)=>{
    console.log('New WebSocket connection')

    socket.on('join', ({ username , room }, callback)=>{
        const { error, user} = addUser({ id: socket.id, username, room })

        if (error) { // means error aaya
            return callback(error)
        }
        
        socket.join(user.room) // inbuild feature of socket.io to join a room

        socket.emit('message', generateMessage('Welcome!')) 
        // socket.broadcast.emit('message', generateMessage('A new user has joined'))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`))

        callback() // joined successfully without error
    })
    
    socket.on('sendMessage', (message, callback)=>{
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }
        
        // io.emit('message', generateMessage(message)) 
        io.to('RoomDelhi').emit('message', generateMessage(message)) 


        // callback('Delivered your msg')
        callback() // this callback does nothing
    })

    socket.on('sendLocation', (coords, callback)=>{
    
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', ()=>{ 
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left`)) 
        }
    })
})

server.listen(port, ()=>{
    console.log(`Server is up on port ${port}!`)
})
