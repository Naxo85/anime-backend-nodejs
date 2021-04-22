const mongoose = require('mongoose');
const dotenv = require('dotenv'); //for adding config variables to the process

dotenv.config({ path: './config.env' });

//DB connection
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection established'));

//node utils/deleteByConsole.js --delete
const deleteData = async () => {
  try {
    //await Anime.deleteMany();
    console.log('Data successfully deleted!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

console.log(process.argv);

if (process.argv[2] === '--delete') {
  deleteData();
}
