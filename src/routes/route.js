const express = require('express');
const router = express.Router();

const bookController = require("../controllers/bookController")




router.post('/books', bookController.createBook)
router.post('/addlink', bookController.addLink)


module.exports = router;