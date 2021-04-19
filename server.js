const mongoose = require('mongoose');
const dotenv = require('dotenv'); //for adding config variables to the process

dotenv.config({ path: './config.env' });

//after adding config variables to the process, require the express app exported by index
const app = require('./index');

//DB connection
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection established'));

//Server initialization
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App running in ${app.get('env')} environment on port ${port}...`);
});
