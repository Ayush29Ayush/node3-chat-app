const path = require('path')
const express = require('express')
const app = express()

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

app.listen(port, ()=>{
    console.log(`Server is up on port ${port}!`)
})

//! Goal: Create an Express web server
//1. Initialize npm and install Express
//2. Setup a new Express server
//   - Serve up a public directory
//   - Listen on port 3000
//3. Create index.html and render "Chat App" to the screen
//4. Test your work! Start the server and view the page in the browser

//! Goal: Setup scripts in package.json
//1. Create a "start" script to start the app using node
//2. Install nodemon and a developement dependency
//3. Create a "dev" script to start the app using nodemon
//4. Run both scripts to test your work!