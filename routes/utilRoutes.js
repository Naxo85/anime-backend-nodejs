//'Mounting the router': this code create like a subApp
// where its root '/' its '/myanime/v1/utils'
const express = require('express');
const utilController = require('../controllers/utilController');

const router = express.Router();

//Routes
router.route('/import').post(utilController.import);

router.route('/getAnimesByGenre').get(utilController.getAnimesByGenre);

module.exports = router;
