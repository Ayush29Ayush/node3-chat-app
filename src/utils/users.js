const users = []

//!Functions to create => addUser , removeUser , getUser , getUsersInRoom

const addUser = ({ id, username, room }) => {
    // 1. Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // 2. Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // 3. Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // 4. Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // 5. Store User
    const user = { id, username, room}
    users.push(user)
    return { user }
}

// 6. Remove User
const removeUser = (id) => {
    // const index = users.findIndex((user)=>{
    //     return user.id === id
    // })

    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0] // used to remove users using index
    }
}

// 7. Testing the above code
addUser({
    id:22,
    username: 'AYUSH',
    room: 'South Philly'
})
console.log(users)

const result1 = addUser({
    id: 33,
    username: '',
    room: ''
})
console.log(result1)

const result2 = addUser({
    id: 33,
    username: 'AYUSH',
    room: 'South Philly'
})
console.log(result2)

// 8. Testing remove user

const removedUser = removeUser(22)
console.log(removedUser)
console.log(users)
