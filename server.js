const express = require("express");
require('dotenv').config()
const app = express();
const morgan = require("morgan");
const db = require("./db/index");
const cors = require("cors");
const helmet = require("helmet")
const models = require("./models/index");
const routes = require('./routes');


const port = 3001
app.use(helmet())
app.use(cors(
  {
   origin: "https://netglobal-security.netlify.app"
 }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("tiny"));


app.use('/', routes);
db.sync({ force: false}).then(() => {
  app.listen(port, () => {
    console.log(`listening port: ${port}`);
  });
});

