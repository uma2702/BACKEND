const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;


app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.post('/createFile', (req, res) => {
    const { filename, content } = req.body;
    if (!filename || !content) {
        return res.status(400).send('Both filename and content are required.');
    }

    fs.writeFile(filename, content, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Failed to create file.');
        }
        console.log(`File ${filename} created.`);
        res.sendStatus(200);
    });
});

app.get('/getFiles', (req, res) => {
    fs.readdir('.', (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Failed to retrieve files.');
        }
        res.json(files);
    });
});

app.get('/getFile', (req, res) => {
    const { filename } = req.query;
    if (!filename) {
        return res.status(400).send('Filename parameter is required.');
    }

    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(400).send(`File ${filename} not found.`);
        }
        res.send(data);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});