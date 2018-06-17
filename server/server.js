require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

const {ObjectID} = require('mongodb');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo(
      {
          text: req.body.text
      }
  );

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res
    .status(400)
    .send(e);
    
  });
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (! ObjectID.isValid(id)) {
      return res.status(404).send('Id invalido.');
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if (todo) {
            return res.status(200).send({todo});
        }
        else {
            return res.status(404).send(`Nenhum to-do encontrado com id ${id} para delecao`);
        }
    }, (e) => {
        return res.status(404).send('Erro ao buscar to-do para delecao');
    }).catch((e) => {
        res.status(400).send();
    }) ;
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    })
});

app.get('/todos/:id', (req, res) => {
    //req possui uma serie de chave-valor onde chave eh o nome do parametro
    //e o valor eh o valor atribuido a ele pela chamada
    //res.send(req.params);
    var id = req.params.id;
    if (! ObjectID.isValid(id)) {
      return res.status(404).send('Id invalido.');
    }
    Todo.findById(id).then((todo) => {
        if (todo) {
            return res.status(200).send({todo});
        }
        else {
            return res.status(404).send(`Nenhum to-do encontrado com id ${id}`);
        }
    }, (e) => {
        return res.status(404).send('Erro ao buscar to-do');
    }).catch((e) => {
        res.status(400).send();
    }) ;
    
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    //A LINHA ACIMA OBTEM DO OBJETO ENVIADO PELO USUARIO
    //APENAS AS PROPRIEDADES QUE QUEREMOS DEIXAR QUE ELE ALTERA
    //[E USADO UM METODO DO FRAMEWORK LODASH PARA OBTER
    // DETERMINADAS PROPRIEDADES DE UM OBJETO]
    if (! ObjectID.isValid(id)) {
        return res.status(404).send('Id invalido.');
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send('Id nao encontrado para update');
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log('Started on port ', port);
});

module.exports = {app};

// var newTodo = new Todo(
//     {
//         text: 'Cook dinner',
//         completed: false,
//         completedAt: 100 
//     }
// );

// newTodo
// .save()
// .then((doc) => {
//         console.log('Todo saved', doc)
//     }, (e) => {
//         console.log('Unable to save todo')
//     }
// );



// var newUser = new User(
//     {
//         email: "simulamail@mail.com"
//     }
// );

// newUser
// .save()
// .then((doc) => {
//     console.log(doc)
// }, (e) => {
//     console.log('Unable to save user')
// });