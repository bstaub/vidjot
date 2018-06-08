const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Create Schema
// http://mongoosejs.com/docs/schematypes.html
// http://mongoosejs.com/docs/api.html#Schema
const IdeaSchema = Schema({
  title:{
    type: String,
    required: true
  },
  details:{
    type: String,
    required: true
  },
  date:{
    type: Date,
    default: Date.now()
  }
});

mongoose.model('ideas', IdeaSchema);