//importing express packages
const express = require("express");
// instantianting a new express server
const app = express();
// selecting network port
const PORT = process.env.PORT || 3000;
// importing path package from standard library
const path = require("path");
const fs = require("fs");
const uuid = require('uuid');
// console.log(uuid.v4())

const { runInNewContext } = require("vm");


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
      req.body.id = uuid.v4();
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

// app.get("/api/notes/:id", (req, res) => {
//   console.log("this should retrieve a specific note")
// })

app.delete("/api/notes/:id", (req, res) => {
  const forDeletion = req.params.id;
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        msg: "oh no! error!",
        err: err,
      });
    } else {
      const dataArr = JSON.parse(data);      
      //what index is the note in the array (find by id)?
      //remove that index from the array
      let index = -1;
      for (let i=0; i<dataArr.length;i++){
        if (dataArr[i].id === forDeletion) {
          index = i;
          break;
        }
      }
      if (index !== -1) {
        //delete from array
        dataArr.splice(index,1);
      }
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
              msg: "successfully deleted!",
            });
          }
        }
      );
    }
  });
  
})

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
  // res.send("should return index.html")
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}!`);
});
