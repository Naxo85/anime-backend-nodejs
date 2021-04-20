const mongoose = require('mongoose');
const dotenv = require('dotenv'); //for adding config variables to the process

dotenv.config({ path: './config.env' });

//require the express app exported by index after adding config variables to the process
const app = require('./index');

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

//Server initialization
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App running in ${app.get('env')} environment on port ${port}...`);
});
