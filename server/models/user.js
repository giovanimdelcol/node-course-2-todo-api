var mongoose = require('mongoose');

var User = mongoose.model('User', {
    email:{
      type: String, 
      required: true,//faz com que propriedade seja obrigatoria
      minlength: 1,//no minimo 1 caracter
      trim: true//limpa espacos antes e depois
    }
});

module.exports = {User};