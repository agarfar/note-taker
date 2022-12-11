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

// DELETE route for removing note from web page
notes.delete('/:id', (req, res) => {
    const { id } = req.params;
    // console.log(req.body);

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            // Convert string into JSON object
            const parsedNotes = JSON.parse(data);
            const deleteNote = parsedNotes.filter(note => note.id !== id);
            // Write updated reviews back to the file
            fs.writeFile(
                './db/db.json',
                JSON.stringify(deleteNote),
                (writeErr) =>
                    writeErr
                        ? console.error(writeErr)
                        : console.info('Successfully deleted note!')
            );
        }
    });
})


module.exports = notes;
