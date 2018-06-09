//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);
//as duas linhas acima criar um ID como o _id seria criado dentro do mongo, permitindo que
//criemos o id e passemos ao mongo para que saibamos de antemao.

//Abaixo um exemplo ES6 de object destructure -> obter uma propriedade de um objeto
//var user = {name: 'Giovani', age:25};
//obteremos a propriedade name do objeto user e a guardaremos na variavel name
//var {name} = user;
//podemos fazer isso com diversas propriedades numa unica chamada


//se for V3 do mongo fica assim:
//MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
      return  console.log('Unable to connect to MongoDB server: ');
      //o return evita que o resto do codigo seja executado, assim o 
      // connected nunca sera logado.
    }
    console.log('Connected to MongoDB server');
//se for V3 do mongo:
//const db = client.db('TodoApp');
    // db.collection('Todos').insertOne({
    //     text: 'Algo a fazer',
    //     completed:false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Nao foi possivel inserir o registro na colecao Todos')
    //     }

    // db.collection('Users').insertOne({
    //     name: 'Giovani',
    //     age:99,
    //     location:'SP'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Nao foi possivel inserir o registro na colecao Users')
    //     }

    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    // });

    db.close();
    //se for V3 do mongo usar client.close();
})