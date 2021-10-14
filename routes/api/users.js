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
    const badResult = (message) => {
        return {
            success: false,
            message: "Cant register" + message,
            data: null
        }
    }
    if (!req.body.name ||
        !req.body.username ||
        !req.body.email ||
        !req.body.password ||
        !req.body.confirm_password) {
        return res.status(400).json(badResult(", All fields required"))
    } else if (req.body.password !== req.body.confirm_password) {
        // Password validation
        return res.status(400).json(badResult(", Passwords do not match"))
    } else {
        //Check for the unique username
        await User.findOne({ username: req.body.username })
            .then(async (user) => {
                if (user) {
                    return res.status(400).json(badResult(", Username is already taken"))
                } else {
                    //Check for the unique email
                    await User.findOne({ email: req.body.email })
                        .then(async (user) => {
                            if (user) {
                                return res.status(400).json(badResult(", Email is already taken"))
                            } else {
                                // Hashing the password
                                const salt = await bcrypt.genSalt(10)
                                const hashPassword = await bcrypt.hash(req.body.password, salt)
                                // Creating a new user object
                                const newUser = new User({
                                    name: req.body.name,
                                    username: req.body.username,
                                    password: hashPassword,
                                    email: req.body.email
                                });
                                // Saving the user
                                await newUser.save()
                                    .then((user) => {
                                        if (user) {
                                            return res.status(200).json({
                                                success: true,
                                                message: "New user added",
                                                data: user
                                            })
                                        } else {
                                            return res.status(400).json({
                                                success: false,
                                                message: "Something went wrong",
                                                data: null
                                            })
                                        }
                                    })
                                    .catch((err) => {
                                        console.log(err)
                                    })
                            }
                        })
                }
            })
    }
})

/**
 * @route POST api/users/login
 * @desc Login the user by username or email
 * @access Public
 * 
*/
router.post('/login', async (req, res) => {
    const badResult = (message) => {
        return {
            success: false,
            message: "Invalid credentials" + message,
            data: null
        }
    }
    const validatePasswordAndLogin = async (user) => {
        if (req.body.password) {
            if (req.body.password.length < 6) {
                res.status(400).json(badResult(", Password is too short"))
            } else {
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
                        res.status(400).json(badResult(""))
                    }
                })
            }
        } else {
            res.status(400).json(badResult(", Password needed"))
        }
    }

    if (req.body.username) {
        await User.findOne({ username: req.body.username })
            .then((user) => {
                // Checking if user exists by username
                if (!user) {
                    return res.status(404).json(badResult(", Username doesn't exist"))
                }
                validatePasswordAndLogin(user);
            })
    } else if (req.body.email) {
        await User.findOne({ email: req.body.email })
            .then((user) => {
                // Checking if user exists email
                if (!user) {
                    return res.status(404).json(badResult(", Email doesn't exist"))
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

