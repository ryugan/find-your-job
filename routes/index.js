var express = require('express');
var router = express.Router();
var HomeController = require("./../controllers/HomeController.js");

/* GET home page. */
router.get('/', HomeController.index);
router.post('/', HomeController.index);

module.exports = router;
