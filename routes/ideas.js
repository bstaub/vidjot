const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Idea Model
require('../models/Ideas');
const Idea = mongoose.model('ideas');


// Add Idea Form
router.get('/add', (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form
router.get('/edit/:id', (req, res) => {
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
router.get('/', (req, res) => {
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
router.post('/', (req, res) => {
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
    res.render('/add', {
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
router.put('/:id', (req, res) => {   //wenn die daten modifiziert werden sollen (put method overriding)
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

router.delete('/:id', (req, res) => {
  //res.send('DELETE');
  Idea.remove({
    _id: req.params.id  //hole id von URL
  })
    .then(()=>{
      req.flash('success_msg', 'Video Idee wurde entfernt');
      res.redirect('/ideas');
    });
});


module.exports = router;