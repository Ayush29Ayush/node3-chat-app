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

//! Goal1 : Send message to correct room

//1. Use getUser inside "sendMessage" event handler to get user data
//2. Emit the message to their current room
//3. Test your work!
//4. Repeat for "sendLocation"

//! Goal2 : Render suername for text messages
//1. Setup the server to send username to client
//2. Edit every call to "generateMessage" to include username
//   - Use "Admin" for sts messages like connect/welcome/disconnect
//3. Update client to render username in template
//4. Test your work!

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))

        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        
        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})