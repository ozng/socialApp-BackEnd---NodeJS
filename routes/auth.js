const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//Register
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body
        // Hashing the password.
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        // Register a new user.
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
        })
        // Saving user, returning response.
        const user = await newUser.save()
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
})

//Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email: email });

        !user && res.status(404).send("User not found")

        const validPassword = await bcrypt.compare(password, user.password)
        !validPassword && res.status(400).send("Wrong Password")

        res.status(200).json(user)

    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;