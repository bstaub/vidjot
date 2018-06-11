const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');


//Connect to mongoose Database(first local db, later mlab)
//get a promise back, you can use also .then() with function or arrow syntax
mongoose.connect('mongodb://localhost/vidjot-dev')
  .then(() => console.log('MongoDB Connected ....'))
  .catch(err => console.log(err));


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


// Use routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = 5000;

app.listen(port, () => {
  console.log(`Server startet auf Port ${port}`);
});