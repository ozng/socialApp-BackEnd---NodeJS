const router = require("express").Router();
const Post = require('../models/Post')

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
// Like post.
// Get a post.
// Get a feed.


module.exports = router;