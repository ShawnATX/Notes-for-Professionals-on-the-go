class Note {
    constructor(title, content, id){
        this.title = title;
        this.text = content;
        this.id = id;
    }

    getTitle(){
        return this.title;
    }

    getText() {
        return this.text;
    }

    getId() {
        return this.id;
    }
}

module.exports = Note;