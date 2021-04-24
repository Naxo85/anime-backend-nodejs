//'Mounting the router': this code create like a subApp
// where its root '/' its '/myanime/v1/animes/'
const express = require('express');
const animeController = require('../controllers/animeController');

const router = express.Router();

//Routes
router.route('/').get(animeController.getAll).post(animeController.addOne);

router.route('/top10').get(animeController.aliasTop10, animeController.getAll);

router.route('/statsBySource').get(animeController.getStatsBySource);

router.route('/statsByGenre').get(animeController.getStatsByGenre);

router
  .route('/:id')
  .get(animeController.getOne)
  .patch(animeController.modifyOne)
  .delete(animeController.deleteOne);

module.exports = router;
