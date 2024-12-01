var express = require("express");
var fs = require("fs");
var PORT = process.env.PORT || 3001;
var app = express();
var notes = "";
fs.readFile("notes.csv", function (err, data) {
    notes = data.toString();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/api", function (req, res) {
    res.json({ message: notes });
});
app.post("/POST", function (req, res) {
    fs.writeFile("notes.csv", req.body.message, function (err) { if (err)
        throw err; });
});
app.listen(PORT, function () {
    console.log("Server listening on ".concat(PORT));
});
