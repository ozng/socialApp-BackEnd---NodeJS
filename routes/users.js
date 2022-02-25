const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Update User
router.put("/:id", async (req, res) => {

    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (err) {
                return res.status(500).json("Something went wrong with updating password.")
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.body.userId, {
                $set: req.body
            })
            res.status(200).json("Profile is updated.")
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("You have no authorization to update this user.")
    }
})
// Delete User
router.delete("/:id", async (req, res) => {

    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.deleteOne({ _id: req.body.userId })
            res.status(200).json("Profile is deleted.")
        } catch (err) {
            return res.status(500).json("Something went wrong.")
        }
    } else {
        return res.status(403).json("You have no authorization to delete this user.")
    }
})
// Get a User
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, updatedAt, ...other } = user._doc
        res.status(200).json(other)
    } catch (err) {
        return res.status(500).json("Something went wrong.")
    }
})
// Follow User
// Unfollow User

module.exports = router;