const express = require('express');
const router = express.Router();

//api/returns/
router.post('/', (req, res) => {
    res.status(401).send('Unauthorized!');
})


module.exports = router;