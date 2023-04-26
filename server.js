const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require('uuid')

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);
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

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
