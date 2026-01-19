const express = require('express');
const app = express();

app.use(express.json()); // this uses middleware to parse JSON bodies
app.use(express.static('public')); //this serves static files from the public directory

module.exports = app;