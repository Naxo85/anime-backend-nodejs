//'Mounting the router': this code create like a subApp
// where its root '/' its '/myanime/v1/users/'
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// //Param middlewares (only for this 'mini app')
router.param('nickname', userController.checkNickName);

//Routes
router.route('/:nickname/animes').get(userController.getUserAnimeList);

module.exports = router;
