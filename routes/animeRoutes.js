//'Mounting the router': this code create like a subApp
// where its root '/' its '/myanime/v1/animes/'
const express = require('express');
const animeController = require('../controllers/animeController');

const router = express.Router();

//Routes
router.route('/').get(animeController.getAll).post(animeController.addOne);

router
  .route('/:id')
  .get(animeController.getOne)
  .put(animeController.modifyOne)
  .delete(animeController.deleteOne);

module.exports = router;
