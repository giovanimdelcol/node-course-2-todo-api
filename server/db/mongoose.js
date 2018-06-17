var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(dbpaprocess.env.MONGODB_URIth);

module.exports = {
    mongoose: mongoose
   };
