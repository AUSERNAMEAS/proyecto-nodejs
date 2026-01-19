require ('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session'); //importing express-session to simulate user sessions


app.use(express.json()); // this uses middleware to parse JSON bodies
app.use(session({
  secret: process.env.SESSION_SECRET || 'secretooo',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(express.static('public')); //this serves static files from the public directory
app.use(express.urlencoded({ extended: true })); // to parse URL-encoded bodies


module.exports = app;