const express = require("express");
const fs = require("fs");

const PORT = process.env.PORT || 3001;

const app = express();

let notes = ""
fs.readFile("notes.csv", (err,data) => {
  notes = data.toString();
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/api", (req, res) => {
    res.json({ message: notes});
  });

app.post("/POST", (req, res) => {
  fs.writeFile("notes.csv",req.body.message, (err) => {if (err) throw err });
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});