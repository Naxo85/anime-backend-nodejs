//'Mounting the router': this code create like a subApp
// where its root '/' its '/myanime/v1/'
const express = require('express');
const router = express.Router();
const rootController = require('../controllers/rootController');

//Routes
router.route('/').get(rootController.getTopAnimes);

module.exports = router;
