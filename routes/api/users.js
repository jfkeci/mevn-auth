const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const key = require('../../config/keys').secret
const User = require('../../models/User.js')

/**
 * @route POST api/users/register
 * @desc Register the user
 * @access Public
 * 
*/
router.post('/register', async (req, res) => {
    // Object destructuring
    let {
        name,
        username,
        email,
        password,
        confirm_password
    } = req.body

    // Password validation
    if (password !== confirm_password) {
        return res.status(400).json({
            success: false,
            message: "Passwords do not match",
            data: null
        })
    } else if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password is too short",
            data: null
        })
    }

    //Check for the unique email and username
    if (req.params.username) {
        await User.findOne({ username: username })
            .then((user) => {
                if (user) {
                    return res.status(400).json({
                        success: false,
                        message: "Username is already taken",
                        data: null
                    })
                }
            })
    } else if (req.params.email) {
        await User.findOne({ email: email })
            .then((user) => {
                if (user) {
                    return res.status(400).json({
                        success: false,
                        message: "Email is already taken",
                        data: null
                    })
                }
            })
    }

    // Creating a new user object
    let newUser = new User({
        name,
        username,
        password,
        email
    });

    // Hashing the password
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash
        })
    })

    // Saving the user
    await newUser.save()
        .then((user) => {
            res.status(200).json({
                success: true,
                message: "New user added",
                data: user
            })
        })
        .catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Something went wrong",
                data: null
            })
        })
})

/**
 * @route POST api/users/login
 * @desc Login the user by username or email
 * @access Public
 * 
*/
router.post('/login', async (req, res) => {

    const validatePasswordAndLogin = (user) => {
        if (req.body.password) {
            if (req.body.password.length < 6) {
                res.status(400).json({
                    success: false,
                    message: "Password is too short",
                    data: null
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Password needed",
                data: null
            })
        }
        bcrypt.compare(req.body.password, user.password).then(matching => {
            // User password is correct, send jwt
            if (matching) {
                const payload = {
                    _id: user._id,
                    username: user.username,
                    name: user.name,
                    email: user.email
                }
                jwt.sign(payload, key, {
                    expiresIn: 604800
                }, (err, token) => {
                    res.status(200).json({
                        success: true,
                        message: "User logged in",
                        data: token
                    })
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: "Unvalid credentials",
                    data: null
                })
            }
        })
    }

    if (req.body.username) {
        await User.findOne({ username: req.body.username })
            .then((user) => {
                // Checking if user exists by username
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: "Username not found",
                        data: null
                    })
                }
                validatePasswordAndLogin(user);
            })
    } else if (req.body.email) {
        await User.findOne({ email: req.body.email })
            .then((user) => {
                // Checking if user exists email
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: "Email not found",
                        data: null
                    })
                }
                validatePasswordAndLogin(user);
            })
    }


})

/**
 * @route GET api/users/
 * @desc Get all users
 * @access Private
 * 
*/
router.get('/', async (req, res) => {
    await User.find().then(users => {
        if (users) {
            res.status(200).json({
                success: true,
                message: "Get all users",
                data: users
            })
        } else {
            res.status(404).json({
                success: false,
                message: "No users found",
                data: null
            })
        }
    })
})


/**
 * @route Delete api/users/
 * @desc Delete user by id
 * @access Private
 * 
*/
router.delete('/:userId', async (req, res) => {
    await User.findByIdAndRemove(req.params.userId).then((user) => {
        if (!user) res.status(404).json({
            success: false,
            message: "User not found",
            data: null
        })
        else res.status(200).json({
            success: true,
            message: "User deleted",
            data: user
        })
    }).catch((err) => {
        res.status(400).json({
            success: false,
            message: `Error: ${err}`,
            data: null
        })
    })

})

module.exports = router;

