const mongoose = require('mongoose');
const dotenv = require('dotenv'); //for adding config variables to the process

dotenv.config({ path: './config.env' });

//after adding variables, run the app file
const app = require('./index');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection established'));

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App running in ${app.get('env')} environment on port ${port}...`);
});
