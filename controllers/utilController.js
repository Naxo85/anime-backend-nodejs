const MalWrapper = require('../Utils/MalWrapper');
const Anime = require('../models/animeModel');
const async = require('async');
const genres = require('../Utils/genres');

const malWrapper = new MalWrapper();

exports.import = async (req, res) => {
  try {
    const addedDBAnimes = [];
    await async.mapLimit(genres, 1, async (genre) => {
      const firstPage = await malWrapper.getAnimesByGenre('anime', genre.id);
      const numberAnimes = firstPage.item_count;
      const numberIterations = Math.ceil(numberAnimes / 100);
      const iterator = Array.from(Array(numberIterations).keys());
      var animesMal;
      await async.mapLimit(iterator, 1, async (key) => {
        console.log(`Importing animes from MyAnimeList: genre ${genre.name} page number ${++key}`);
        //external API has rate limits: (30 requests/minute) & (2 requests/second)
        await sleep(2000);
        animesMal = await malWrapper.getAnimesByGenre('anime', genre.id, key);
        await addAnimeListToDB(animesMal.anime, 100, addedDBAnimes);
      });
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
    genresAnime = [];
    for (const genre of anime.genres) {
      genresAnime.push(genre.name);
    }
    const newAnime = new Anime({
      title: anime.title,
      malId: anime.mal_id,
      imageUrl: anime.image_url,
      rating: anime.score,
      year: anime.airing_start !== null ? anime.airing_start.split('-')[0] : null,
      type: anime.type,
      synopsis: anime.synopsis,
      episodes: anime.episodes,
      source: anime.source,
      studioName: anime.producers !== null ? anime.producers.name : null,
      genres: genresAnime,
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

exports.getAnimesByGenre = async (req, res) => {
  try {
    const animesMal = await malWrapper.getAnimesByGenre('anime', 1);
    res.status(200).json({
      status: 'success',
      results: animesMal.anime.length,
      data: animesMal.anime,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'failed',
      data: 'Internal Error',
    });
  }
};
