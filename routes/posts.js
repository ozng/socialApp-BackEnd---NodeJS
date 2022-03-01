const router = require("express").Router();
const Post = require('../models/Post')
const User = require('../models/User')

// Create post.

router.post("/", async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (err) {
        res.status(500).json("Something went wrong with creating a post.")
    }
})
// Update post.
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("The post has been updated.")
        } else {
            res.status(403).json("You cannot authorize to update this post.")
        }

    } catch (err) {
        res.status(500).json("Something went wrong with updating a post.")
    }
})
// Delete post.
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("The post has been deleted.")
        } else {
            res.status(403).json("You cannot authorize to delete this post.")
        }

    } catch (err) {
        res.status(500).json("Something went wrong with deleting a post.")
    }
})
// Like and unlike post.

router.put('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post.like.includes(req.body.userId)) {
            await post.updateOne({ $push: { like: req.body.userId } })
            res.status(200).json("You have been like this post")
        } else {
            await post.updateOne({ $pull: { like: req.body.userId } })
            res.status(200).json("You have been unlike this post")
        }

    } catch (err) {
        res.status(500).json("Something went wrong.")
    }

})
// Get a post.

router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json("Something went wrong.")
    }
})
// Get a feed.

router.get("/feed/:userId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId)
        const userPosts = await Post.find({ userId: currentUser._id })
        const friendPosts = await Promise.all(
            currentUser.following.map(friendId => {
                return Post.find({ userId: friendId })
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts))
    } catch (err) {
        res.status(500).json("Something went wrong.")
    }
})

//Get users all posts.
router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.find({ username: req.params.username })
        const posts = await Post.find({ userId: user[0]._id })
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json("Something went wrong.")
    }
})

module.exports = router;