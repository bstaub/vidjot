const express = require('express');
const exphbs  = require('express-handlebars');

const app = express();

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


const port = 5000;

app.listen(port, () => {
  console.log(`Server startet auf Port ${port}`);
});