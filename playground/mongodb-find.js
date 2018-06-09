const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
      return  console.log('Unable to connect to MongoDB server: ');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos')
    //   .find({
    //     _id: new ObjectID('5b1c2a47912ff41fd005bd30')})
    //   .toArray()
    //   .then((docs) =>{
    //         console.log('To-dos');
    //         console.log(JSON.stringify(docs, undefined, 2));
    //     }, (err) => {
    //         console.log('unable to fetch dados',err);
    //   });

    db.collection('Users')
    .find({name:'Giovani'})
    .count()
    .then((count) =>{
          console.log(`Users count: ${count}`);
      }, (err) => {
          console.log('unable to fetch dados',err);
    });

    //db.close();
});