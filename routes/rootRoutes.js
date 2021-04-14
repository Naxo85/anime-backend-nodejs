//'Mounting the router': this code create like a subApp
// where its root '/' its '/myanime/v1/'
const express = require('express');
const rootController = require('../controllers/rootController');

const router = express.Router();

//Routes
router.route('/').get(rootController.getTopAnimes);

module.exports = router;
