const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require('uuid')

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//route to get to the notes html page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

//route to get all the data from the db.json file
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ msg: "error reading db" });
    } else {
      const dataArray = JSON.parse(data);
      return res.json(dataArray);
    }
  });
});

//route to post a new note and add it to the db.json file
app.post("/api/notes", (req,res)=>{
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
          return res.status(500).json({ msg: "error reading db" });
        } else {
          const dataArray = JSON.parse(data);
          const newNote = {
            id: uuid.v4(),
            title: req.body.title,
            text: req.body.text
          }
          dataArray.push(newNote)
          fs.writeFile('./db/db.json',JSON.stringify(dataArray,null,4),(err)=>{
            if(err){
                return res.status(500).json({msg:"error writing db"})
            }else{
                return res.json(newNote)
            }
          })
        }
      });
});

//route to delete to notes from the db.json
app.delete("/api/notes/:id",(req,res)=>{
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
          return res.status(500).json({ msg: "error reading db" });
        } else {
          const dataArray = JSON.parse(data);
          for (let i = 0; i < dataArray.length; i++) {
            const element = dataArray[i].id;
            console.log(typeof element)
            console.log(typeof req.params.id)
            if(element == req.params.id){
                dataArray.splice(i,1)
                fs.writeFile("./db/db.json",JSON.stringify(dataArray,null,4),(err)=>{
                    if(err){
                        return res.status(500).json({msg:"error writing db"})
                    }else{
                        return res.json(dataArray)
                    }
                })
                
          }
        }
        }
    })
})

//route to get the homepage if they go to anyroute that isnt specified
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
