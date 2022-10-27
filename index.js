//importing express packages
const express = require("express");
// instantianting a new express server
const app = express();
// selecting network port
const PORT = process.env.PORT || 3000;
// importing path package from standard library
const path = require("path");
const fs = require("fs");

//middle ware to serve static assets
app.use(express.static("public"));

//data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("this is a homepage");
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
  // res.send("should return notes.html")
});

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        msg: "oh no! error!",
        err: err,
      });
    } else {
      const dataArr = JSON.parse(data);
      res.json(dataArr);
    }
  });
  // res.send("should read db.json")
  // res.send(req.body)
});

app.post("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        msg: "oh no! error!",
        err: err,
      });
    } else {
      const dataArr = JSON.parse(data);
      dataArr.push(req.body);
      fs.writeFile(
        "./db/db.json",
        JSON.stringify(dataArr, null, 4),
        (err, data) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              msg: "oh no! error!",
              err: err,
            });
          } else {
            res.json({
              msg: "successfully added!",
            });
          }
        }
      );
    }
  });
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
  // res.send("should return index.html")
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}!`);
});
