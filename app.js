const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();

//Connect to mongoose Database(first local db, later mlab)
//get a promise back, you can use also .then() with function or arrow syntax
mongoose.connect('mongodb://localhost/vidjot-dev')
  .then(() => console.log('MongoDB Connected ....'))
  .catch(err => console.log(err));

// Load Idea Model
require('./models/Ideas');
const Idea = mongoose.model('ideas');

//Express Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


//Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
app.use(bodyParser.json())


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

// Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
  //res.render('ideas/edit');
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea: idea
    });
  })

});

// Add Ideas List
app.get('/ideas', (req, res) => {
  //res.send('daten erfolgreich in ideas eingetragen');
  //res.render('ideas/index');
  Idea.find({})  //all queries, also pass an empty object, it returns a promise..
    .sort({date: 'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });

});

// Process Form
app.post('/ideas', (req, res) => {
  //console.log(req.body);  //log form input in console, needs bodyParser with Middleware
  //res.send('ok');

  //validation on server side (could also validate inputs on client side..)
  let errors = [];

  if (!req.body.title) {
    errors.push({text: 'Bitte einen Titel hinzufügen'});

  }
  if (!req.body.details) {
    errors.push({text: 'Bitte eine Beschreibung hinzufügen'});
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    //res.send('Daten erfolgreich eingetragen');

    const newIdea = {
      title: req.body.title,
      details: req.body.details
    }

    new Idea(newIdea)
      .save()
      .then(idea => {
        res.redirect('/ideas');
      })
  }

});


const port = 5000;

app.listen(port, () => {
  console.log(`Server startet auf Port ${port}`);
});