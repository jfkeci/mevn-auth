const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const passport = require('passport')

// Require the routes
const userRoute = require('./routes/api/users')

// Init app
const app = express();

// Middlewares
app.use(express.json())
app.use(cors())

// Passport middleware
app.use(passport.initialize());
// Bring in the passport strategy
require('./config/passport')(passport)

// Setting up the static directory
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'uploads')))


// Bring in the Database config
const db = require('./config/keys').mongoURI
// Database connection
mongoose.connect(db, {
    useNewUrlParser: true
}).then(() => {
    console.log("Connected to mongodb database")
}).catch((err) => {
    console.log(`Unable to connect to database: ${err}`)
})

app.use('/api/user', userRoute)

// Bring in the PORT
const PORT = require('./config/keys').port
// Starting up the server
app.listen(PORT, () => {
    console.log("Server started on port: " + PORT)
})