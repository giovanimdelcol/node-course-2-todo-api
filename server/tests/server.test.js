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
    text: "Second Dummy",
    completed: true,
    completedAt: 333
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

describe('DELETE /todos/:id', () => {
    it('Should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.findById(hexId).then((todo) => {
                expect(todo).toNotExist();
                done()
            }).catch((e) => done(e));
        });
    });

    it('should return 404 if no to-do found', (done) =>{
        request(app)
        .delete(`/todos/${new ObjectId().toHexString()}`)
        .expect(404)
        .end(done);   
    });

    it('should return 404 if id is invalid', (done) =>{
        request(app)
        .delete(`/todos/123`)
        .expect(404)
        .end(done);   
    });
});

describe('PATCH /todos/:id', () => {
    it('Should update the to-do', (done) => {
      var hexId = todos[0]._id.toHexString();
      todos[0].text = 'Alterado pelo teste PATCH';
      todos[0].completed = true;  
      request(app)
      .patch(`/todos/${hexId}`)
      .send(todos[0])
      .expect(200)
      .expect( (res) => {
          expect(res.body.todo.text).toEqual('Alterado pelo teste PATCH');
          expect(res.body.todo.completed).toBeTruthy();
          expect(res.body.todo.completedAt).toBeA('number');
      } )
      .end(done);
    });

    it('Should clear completedAt when to-do is not completed', (done) => {
        var hexId = todos[0]._id.toHexString();
        todos[0].text = 'Alterado pelo teste PATCH 2';
        todos[0].completed = false;  
        request(app)
        .patch(`/todos/${hexId}`)
        .send(todos[0])
        .expect(200)
        .expect( (res) => {
            expect(res.body.todo.text).toEqual('Alterado pelo teste PATCH 2');
            expect(res.body.todo.completed).toBeFalsy();
            expect(res.body.todo.completedAt).toNotExist();
        } )
        .end(done);
    });
});
