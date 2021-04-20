const MalWrapper = require('../modules/MalWrapper');
const Anime = require('../models/animeModel');
const async = require('async');

const malWrapper = new MalWrapper();

exports.import = async (req, res) => {
  try {
    const iterator = Array.from(Array(100).keys());
    const addedDBAnimes = [];
    await async.mapLimit(iterator, 1, async (key) => {
      console.log(`Importing the top anime list from MyAnimeList: page number ${key}`);
      //external API has rate limits: (30 requests/minute) & (2 requests/second)
      await sleep(2000);
      const animesMal = await malWrapper.findTop('anime', ++key);
      await addAnimeListToDB(animesMal.top, 50, addedDBAnimes);
    });
    res.status(200).json({
      status: 'success',
      results: addedDBAnimes.length,
      data: addedDBAnimes,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'failed',
      data: 'Internal Error',
    });
  }
};

function addAnimeListToDB(animeList, limit, addedList) {
  return async.mapLimit(animeList, limit, async (anime) => {
    const newAnime = new Anime({
      title: anime.title,
      malId: anime.mal_id,
      imageUrl: anime.image_url,
      rating: anime.score,
      year: anime.start_date !== null ? anime.start_date.split(' ')[1] : null,
      type: anime.type,
    });
    const animeDB = await Anime.findOne({ title: newAnime.title });
    if (animeDB === null) {
      await Anime.create(newAnime);
      addedList.push(newAnime);
    } else {
      console.log('An anime with title "' + newAnime.title + '" already exists');
    }
  });
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
