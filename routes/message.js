const router = require("express").Router();
const Message = require('../models/Message')

//add

router.post("/", async (req, res) => {
    const newMssg = new Message(req.body)
    try {
        const savedMsg = await newMssg.save()
        res.status(200).json(savedMsg)
    } catch (err) {
        res.status(500).json(err)
    }

})

//get

router.get("/:conversationId", async (req, res) => {

    try {
        const messages = await Message.find({ conversationId: req.params.conversationId })
        res.status(200).json(messages)
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router;