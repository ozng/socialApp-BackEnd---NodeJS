const router = require("express").Router();
const Conversation = require('../models/Conversation')

// New conv

router.post("/", async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.recieverId]
    })

    try {
        const savedConv = await newConversation.save()
        res.status(200).json(savedConv)
    } catch (err) {
        res.status(500).json(err)
    }
})
// Get Conv

router.get("/:userId", async (req, res) => {
    try {
        const conv = await Conversation.find({
            members: { $in: [req.params.userId] }
        })

        res.status(200).json(conv)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;