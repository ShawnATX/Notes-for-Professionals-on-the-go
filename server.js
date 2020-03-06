var express = require("express");
var path = require("path");
var fs = require("fs");
var Note = require("./lib/Note");
var shortid = require("shortid");

var app = express();
var PORT = 3001;
app.use(express.static('public'))


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const updateDb = (notes) => {
    fs.writeFile('./db/db.json', notes, (err) => {
        if (err) {
            throw err;
        }
        console.log("DB updated!");
    })
};


app.get("/notes", (req, res) =>{
    console.log("GET /notes");
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    console.log("API GET Notes")
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        res.json( JSON.parse(data) );
    });
});

app.delete("/api/notes:id", (req, res) => {
    console.log(id);
    res.send("Got a DELETE request");
});

app.post("/api/notes", (req, res) => {
    const { title, text } = req.body;
    const newNote = new Note(title, text, shortid.generate());
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        let savedNotes = JSON.parse(data);
        savedNotes.push(newNote);
        updateDb(JSON.stringify(savedNotes));
    });
    res.send("Saved");
});



app.get("*", (req, res) => {
    console.log("GET *");
    res.sendFile(path.join(__dirname, "./public/index.html"));
});


app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});
