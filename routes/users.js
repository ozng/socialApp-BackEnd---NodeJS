const router = require('express').Router();

router.get("/", (req, res) => {
    res.send('User routes')
})

module.exports = router;