const express = require("express");
const cors = require("cors");
const config = require("./src/config.js");
require("dotenv").config();

const app = new express();

app.use(cors());
app.use(express.json());

app.get("/", ({ res }) => {
  res.send("D campus Phone Book");
});

require("./src/db/dbConfig.js")();
require("./src/startup/router.js")(app);

config(app);

let PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`app listening at ${PORT}`);
});
