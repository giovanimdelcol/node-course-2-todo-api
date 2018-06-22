const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

//o Schema permite que especifiquemos as propriedades da classe
var UserSchema = new mongoose.Schema({
  email:{
    type: String, 
    required: true,//faz com que propriedade seja obrigatoria
    minlength: 1,//no minimo 1 caracter
    trim: true, //limpa espacos antes e depois
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]

});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};

//schema.methods da acesso as funcoes de instancia
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens = user.tokens.concat([{access, token}]);
  
  return user.save().then(() => {
    return token;
  });
}; // aqui nao podemos usar arrow functions, pois o this sera usado

var User = mongoose.model('User', UserSchema);

module.exports = {User};