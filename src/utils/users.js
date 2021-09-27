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

//! Goal: Create two new functions for users
//1. Create getUser
//   - Accept id and return user object ( or undefined )
//2. Create getUsersInRoom
//   - Accept room name and return array of users (or empty array)
//3. Test your work by caling the functions!

const getUser = (id) => {
    return users.find((user)=> user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}



// 7. Testing the above code
addUser({
    id:22,
    username: 'AYUSH',
    room: 'South Philly'
})
addUser({
    id:42,
    username: 'Senapati',
    room: 'South Philly'
})
console.log('Total users are => ', users)

//! gives correct output 
const user = getUser(22)
// console.log(user)

//! gives undefined since no user by that id
const user1 = getUser(221)
// console.log(user1)

//! gives correct output
const userList = getUsersInRoom('South Philly')
console.log('The User List is => ',userList)

//! gives undefined since no users by that room
const userList1 = getUsersInRoom('Canada')
console.log('The User List is => ',userList1)

// // 8. Testing remove user

// const removedUser = removeUser(22)
// console.log(removedUser)
// console.log(users)

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}