//adding config variables to the process
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

//after run the app file
const app = require('./index');

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App running in ${app.get('env')} environment on port ${port}...`);
});
