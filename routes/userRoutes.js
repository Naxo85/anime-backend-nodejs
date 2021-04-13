//'Mounting the router': this code create like a subApp
// where its root '/' its '/myanime/v1/users/'
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//Routes
router.route('/:nickname/animes').get(userController.getUserAnimeList);

module.exports = router;
