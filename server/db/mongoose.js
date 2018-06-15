var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const dbpath = process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp';
mongoose.connect(dbpath);

module.exports = {
    mongoose: mongoose
   };