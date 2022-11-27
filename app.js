const express = require("express");
const cors = require("cors");

const app = new express();

app.use(cors());
app.use(express.json());

require("./src/db/dbConfig.js")();
require("./src/startup/router.js")(app);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`app listening at ${PORT}`);
});
