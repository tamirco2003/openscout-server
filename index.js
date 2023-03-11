const express = require('express');
const path = require('path');
const api = require("./api");
const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1/openscout-2023-dev');

const app = express();
const port = 3000;

app.use('/api', api);

// If file, serve file.
app.use(express.static(path.join(__dirname, 'build')));
// Otherwise, serve index.html.
app.get("*", (req, res) => res.sendFile(path.join(__dirname + '/build', 'index.html')));


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
