const express = require("express");
const cors = require("cors");
const findUNikolson = require("./nikolson.js");
const findU = require("./solve.js");
const app = express();

app.use(express.json());
app.use(cors());

app.post("/", (req, res) => {
  const { l, L, n, λ, I, K } = req.body;
  const u = findU(l, L, n, λ, I, K);

  res.status(200).send(u.map((u) => u.map((v) => v.abs())));
});

app.listen(5000, () => console.log("Server running"));

module.exports = {
  findU,
};
