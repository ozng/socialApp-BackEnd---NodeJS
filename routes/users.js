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
                return res.status(500).json("Something went wrong with updating your password.")
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.body.userId, {
                $set: req.body
            })
            res.status(200).json("Profile is updated.")
        } catch (err) {
            return res.status(500).json("Something went wrong with updating your profile")
        }
    } else {
        return res.status(403).json("You cannot authorize to update this user.")
    }
})
// Delete User
router.delete("/:id", async (req, res) => {

    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.deleteOne({ _id: req.body.userId })
            res.status(200).json("Profile is deleted.")
        } catch (err) {
            return res.status(500).json("Something went wrong with deleting.")
        }
    } else {
        return res.status(403).json("You have no authorization to delete this user.")
    }
})
// Get a User
router.get('/', async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;

    try {
        const user = userId ? await User.findById(userId) : await User.findOne({ username: username })
        const { password, updatedAt, ...other } = user._doc
        res.status(200).json(other)
    } catch (err) {
        return res.status(500).json("Something went wrong.")
    }
})

// Get Friends
router.get("/friends/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)

        const friends = await Promise.all(
            user.following.map(friendId => {
                return User.findById(friendId)
            })
        )

        let friendList = [];

        friends.map(friend => {
            const { _id, username, profilePicture } = friend
            friendList.push({
                _id, username, profilePicture
            })
        })

        res.status(200).json(friendList);

    } catch (err) {
        res.status(500).json(err)
    }
})


// Follow User
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (!user.follower.includes(req.body.userId)) {
                await user.updateOne({ $push: { follower: req.body.userId } })
                await currentUser.updateOne({ $push: { following: req.params.id } })
                res.status(200).json(`You have follow ${user.username}.`)
            } else {
                res.status(403).json('You already follow this user.')
            }
        } catch (err) {
            res.status(500).json("Something went wrong.")
        }
    } else {
        res.status(403).json("You cannot follow yourself.")
    }
})
// Unfollow User
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (user.follower.includes(req.body.userId)) {
                await user.updateOne({ $pull: { follower: req.body.userId } })
                await currentUser.updateOne({ $pull: { following: req.params.id } })
                res.status(200).json(`You have unfollow ${user.username}.`)
            } else {
                res.status(403).json('You already not follow this user.')
            }
        } catch (err) {
            res.status(500).json("Something went wrong.")
        }
    } else {
        res.status(403).json("You cannot unfollow yourself.")
    }
})

module.exports = router;