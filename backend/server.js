require("dotenv").config();

const express = require("express");
const cors = require("cors");

const uploadRoutes = require("./routes/upload");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", uploadRoutes);
app.use("/test", require("./routes/test"));

app.listen(5000, () => {
  console.log("running");
});
