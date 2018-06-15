const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {ObjectId} = require('mongodb');

const todos = [{
    _id: new ObjectId(),
    text: "First Dummy"
}, {
    _id: new ObjectId(),
    text: "Second Dummy"
}];

beforeEach((done) => {
  Todo.remove([])
  .then(() => {
    return Todo.insertMany(todos);      
  }).then(()=> done());
  //zera a base antes de cada teste
});

describe('POST /todos', () => {
  it('Should create a new To-do', (done) => {
    var text = 'Todo text - Test';

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res) => {
        expect(res.body.text).toBe(text);
    })
    .end((err, res)  => {
        if (err) {
            return done(err);
        }

        Todo.find({text}).then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
        }).catch((e) => done(e));
    });
  });

  it ('Nao deve criar to-do com body invalido', (done) => {
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err, res) => {
        if (err) {
            return done(err);
        }

        Todo.find().then((todos) => {
            expect(todos.length).toBe(2);
            done();
        }).catch((e) => {
            done(e);
        })
    })
  });
});

describe('GET /todos', () => {
    it('Should get all to-dos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
});

describe('GET /todos/:id',  () => {
    it('Should return to-do doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('Should return 404 if to-do not found', (done) => {
        request(app)
        .get(`/todos/${new ObjectId().toHexString()}`)
        .expect(404)
        .end(done);        
    });

    it('Should return 404 non-objects ids (ids invalidos)', (done) => {
        request(app)
        .get(`/todos/123`)
        .expect(404)
        .end(done);        
    });
});
