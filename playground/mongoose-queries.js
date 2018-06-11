const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5b1f00ba2134e88010b2ddeb22';

// if (!ObjectID.isValid(id)) {
//     console.log('ID invalido');
// }

// Todo.find(
//     {
//         _id: id
//     }
// )
// .then(
//     (todos) => {
//         console.log('To-dos', todos);
//     }
// );

// Todo.findOne(
//     {
//         _id: id
//     }
// )
// .then(
//     (todo) => {
//         console.log('To-do', todo);
//     }
// );

// Todo.findById(id)
// .then(
//     (todo) => {
//         if (!todo) {
//             return console.log('ID nao encontrado')
//         }
//         console.log('To-do by ID', todo);
//     }
// )
// .catch((e) => console.log(e));

User.findById('5b1d0c69f404f83c24ceedba')
.then(
    (user) => {
      if(!user) {
          return console.log('User nao encontrado.');
      }

      console.log(JSON.stringify(user, undefined, 2));
    },
    (e) => {
      console.log(e);  
    }
);