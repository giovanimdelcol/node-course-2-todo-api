var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    text:{
      type: String, 
      required: true,//faz com que propriedade seja obrigatoria
      minlength: 1,//no minimo 1 caracter
      trim: true//limpa espacos antes e depois
    },
    completed:{
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Number,
      default: null
    }    
});

module.exports = {Todo};
