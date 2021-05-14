// Using Node.js `require()`
const mongoose = require('mongoose'); 
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

 