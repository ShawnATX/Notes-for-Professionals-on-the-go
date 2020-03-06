var express = require("express");
var path = require("path");
var fs = require("fs");
var Note = require("./lib/Note");
var shortid = require("shortid");

var app = express();
var PORT = 3001;
app.use(express.static('public'));


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
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        res.json( JSON.parse(data) );
    });
});

app.delete("/api/notes/:id", (req, res) => {
    let id = req.params.id;
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        let savedNotes = JSON.parse(data);
        for (note in savedNotes) {
            if (savedNotes[note].id === id) {
                savedNotes.splice(note, 1);
                updateDb(JSON.stringify(savedNotes));
                return;
            }
        }
    });
    res.end();
});

app.post("/api/notes", (req, res) => {
    const { title, text, id } = req.body;
    const newNote = new Note(title, text, shortid.generate());
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        let savedNotes = JSON.parse(data);
        // Testing for existing matching id to avoid saving duplicates
        for (note in savedNotes) {
            if (savedNotes[note].id === id){
                res.end();
                return;
            }
        }
        savedNotes.push(newNote);
        updateDb(JSON.stringify(savedNotes));
    });
    res.send("Saved");
});



app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});


app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});
