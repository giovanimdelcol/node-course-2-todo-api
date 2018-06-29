const {Todo} = require('./../../models/todo');
const {ObjectID} = require('mongodb');

const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'giovani@exemplo.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]

}, {
    _id: userTwoId,
    email: 'jen@example.com',
    password: 'userTwoPass'
    
}];

const todos = [{
    _id: new ObjectID(),
    text: "First Dummy"
}, {
    _id: new ObjectID(),
    text: "Second Dummy",
    completed: true,
    completedAt: 333
}];

const populateTodos = (done) => {
    Todo.remove([{}])
    .then(() => {
      return Todo.insertMany(todos);      
    }).then(()=> done());
    //zera a base antes de cada teste
  };

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};