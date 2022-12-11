const notes = require('express').Router();
const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');
const fs = require('fs');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route for a new note
notes.post('/', (req, res) => {
    console.log(req.body);
    const { title, text } = req.body;
    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };
        readAndAppend(newNote, './db/db.json');
        res.json(`Note added successfully 🚀`);
    } else {
        res.error('Error in adding note');
    }
});

// DELETE Route for deleting note
notes.delete('/:id', (req, res) => {
    const { id } = req.params;
    readFromFile('./db/db.json').then((data) => {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);
        const deleteNote = parsedNotes.filter(note => note.id !== id);
        // Write updated notes back to the file
        fs.writeFile(
            './db/db.json',
            JSON.stringify(deleteNote),
            (writeErr) =>
                writeErr
                    ? console.error(writeErr)
                    : console.info('Successfully deleted note!')
        );
        res.json(`Note '${req.params.title}' has been deleted`);
    });
});

module.exports = notes;
