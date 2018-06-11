const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
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

//methodOverride Middleware, override using a query value
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))


//Exress Session Middleware
app.use(session({
  secret: 'mysecret',
  resave: true,
  saveUninitialized: true,
}))

app.use(flash());

// Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');   //sussess message put in variable and output in template
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');  //for later when we are using passport, ex. user not found..
  next();
});


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

// Fetch-Demo mit Promise und Async Await
app.get('/fetch', (req, res) => {
  //res.send('ABOUT');

  function testPromise(){
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(resp => resp.json())
      .then(console.log)
  }

  async function fetchUsers(){
    const resp = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await resp.json();
    console.log(data);
  }

  //fetchUsers();


  //res.render('fetch');
});


// Fetch-Demo mit Promise und Async Await
app.get('/promise', (req, res) => {
  //res.send('Promise');
  res.render('promise');


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
  console.log(req.body);  //log form input in console, needs bodyParser with Middleware
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
      .then(idee => {
        //console.log(idea);  //ist das objekt gemeint, wird aber eigentlich nicht weiter verwendet
        req.flash('success_msg', 'Video '+idee.title+' Idee wurde hinzugefügt');
        res.redirect('/ideas');
      })
  }

});

//Modify Put Input
app.put('/ideas/:id', (req, res) => {   //wenn die daten modifiziert werden sollen (put method overriding)
  //res.send('PUT');
  Idea.findOne({
    _id: req.params.id  //hole id von URL
  })
    .then(idea => {
      idea.title = req.body.title;    //übergebe modifizierte werte
      idea.details = req.body.details;

      idea.save()
        .then(idea =>{
          req.flash('success_msg', 'Video Idee wurde aktualisiert');
          res.redirect('/ideas');
        });

    })
});

app.delete('/ideas/:id', (req, res) => {
  //res.send('DELETE');
  Idea.remove({
    _id: req.params.id  //hole id von URL
  })
    .then(()=>{
      req.flash('success_msg', 'Video Idee wurde entfernt');
      res.redirect('/ideas');
    });
});



const port = 5000;

app.listen(port, () => {
  console.log(`Server startet auf Port ${port}`);
});