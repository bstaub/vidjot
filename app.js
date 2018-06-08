const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');


const app = express();

//Connect to mongoose Database(first local db, later mlab)
//get a promise back, you can use also .then() with function or arrow syntax
mongoose.connect('mongodb://localhost/vidjot-dev')
  .then(() => console.log('MongoDB Connected ....'))
  .catch(err => console.log(err));

// Load Idea Model
require('./models/Ideas');
const Idea = mongoose.model('ideas');

//Setup Express Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// How middleware works
//app.use(function(req, res, next){
  //console.log(Date.now()); //log timestamp
  //req.name = 'Bruno Staub'; //variable req.name in middleware hängen
  //next(); //next middleware to run, wenn middleware aktiviert ist muss next() aktiviert sein!
//});

// Index Route
app.get('/', (req, res) => {
  //res.send(req.name);  //auf middleware zugreifen und ausgeben
  //res.send('INDEX');
  const title = 'Herzlich Willkommen';
  res.render('index', {
    title: title
  });  //define layout and page with startpoint home
});

// About Route
app.get('/about', (req, res) => {
  //res.send('ABOUT');
  res.render('about');
});

// Add Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});


const port = 5000;

app.listen(port, () => {
  console.log(`Server startet auf Port ${port}`);
});