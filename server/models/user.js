const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
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

//tudo que adicionamos ao .methods vira metodo de instancia
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this; //o this aqui eh a instancia (o objeto)
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token;
  });
};

//tudo que adicionamos ao .statics vira metodo de classe
UserSchema.statics.findByToken = function (token) {
  var User = this; //o this aqui eh a classe (o model)
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    return Promise.reject();
    //AS LINHAS ABAIXO SAO EQUIVALENTES A LINHA ACIMA, ambas retornar a rejeicao de uma promise
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
  }

  return User.findOne({
    '_id': decoded._id,
    //precisamos colocar entre aspas pois especificamos uma propriedade aninhada para
    //procurar o objeto -> tokens.token
    'tokens.token': token,
    'tokens.access': 'auth'
  });

};

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      //bcrypt nao tem suporte a promise, por isso fica dentro de uma
      bcrypt.compare(password, user.password, 
        (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }

      });
    });
  });
};

UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    var password = user.password;
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User}
