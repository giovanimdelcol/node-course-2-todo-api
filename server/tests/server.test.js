const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {ObjectId} = require('mongodb');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('Should create a new To-do', (done) => {
    var text = 'Todo text - Test';

    request(app)
    .post('/todos')
    .set('x-auth', users[0].tokens[0].token)
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
    .set('x-auth', users[0].tokens[0].token)
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
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(1);
        })
        .end(done);
    });
});

describe('GET /todos/:id',  () => {
    it('Should return to-do doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('Should return to-do doc from another user', (done) => {
        request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('Should return 404 if to-do not found', (done) => {
        request(app)
        .get(`/todos/${new ObjectId().toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);        
    });

    it('Should return 404 non-objects ids (ids invalidos)', (done) => {
        request(app)
        .get(`/todos/123`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);        
    });
});

describe('DELETE /todos/:id', () => {
    it('Should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.findById(hexId).then((todo) => {
                expect(todo).toBeFalsy();//equivalente ao toNotExist do antigo expect
                done()
            }).catch((e) => done(e));
        });
    });

    it('Should not remove a todo without proper user', (done) => {
        var hexId = todos[0]._id.toHexString();

        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404) 
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            Todo.findById(hexId).then((todo) => {
                expect(todo).toBeTruthy();//equivalente ao toExist do antigo expect
                done()
            }).catch((e) => done(e));
        });
    });

    it('should return 404 if no to-do found', (done) =>{
        request(app)
        .delete(`/todos/${new ObjectId().toHexString()}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done);   
    });

    it('should return 404 if id is invalid', (done) =>{
        request(app)
        .delete(`/todos/123`)
        .set('x-auth', users[1].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
      .send(todos[0])
      .expect(200)
      .expect( (res) => {
          expect(res.body.todo.text).toEqual('Alterado pelo teste PATCH');
          expect(res.body.todo.completed).toBeTruthy();
          //expect(res.body.todo.completedAt).toBeA('number');
          //toBeA nao tem equivalente no novo expect, fazemos o seguinte para suprir:
          expect(typeof res.body.todo.completedAt).toBe('number');
      } )
      .end(done);
    });

    it('Should NOT update the to-do created by another user', (done) => {
      var hexId = todos[0]._id.toHexString();
      todos[0].text = 'Alterado pelo teste PATCH';
      todos[0].completed = true;  
      request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send(todos[0])
      .expect(404)
      .end(done);
    });

    it('Should clear completedAt when to-do is not completed', (done) => {
        var hexId = todos[0]._id.toHexString();
        todos[0].text = 'Alterado pelo teste PATCH 2';
        todos[0].completed = false;  
        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)
        .send(todos[0])
        .expect(200)
        .expect( (res) => {
            expect(res.body.todo.text).toEqual('Alterado pelo teste PATCH 2');
            expect(res.body.todo.completed).toBeFalsy();
            expect(res.body.todo.completedAt).toBeFalsy();
        } )
        .end(done);
    });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
      request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
          expect(res.body._id).toBe(users[0]._id.toHexString());
          expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', '123')
    .expect(401)
    .expect((res) => {
        expect(res.body).toEqual({});
    })
    .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
    })
    .end((err) => {
        if (err) {
            return done(err);
        }
        User.findOne({email}).then((user) => {
            expect(user).toBeTruthy();
            //expect(user.password).toNotBe(password);
            //toNotBe nao tem equivalente no novo expect, para suprir:
            expect(user.password).not.toBe(password);
            done();
        }).catch((e) => done(e));
    });
  });
  it('should return validation errors if request invalid', (done) => {
    request(app)
    .post('/users')
    .send({
        email: 'invlid',
        password: '123'
    })
    .expect(400)
    .end(done);
  });
  it('should not create user if email in use', (done) => {
    request(app)
    .post('/users')
    .send({
        email: users[0].email,
        password:'password123!'
    })
    .expect(400)
    .end(done);
  });
});

describe('POST /users/login', () =>{
    it('should login user and return auth token', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password
        })
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            User.findById(users[1]._id).then((user) => {
                // expect(user.tokens[1]).toInclude({
                //     access:'auth',
                //     token: res.headers['x-auth']
                // });
                //to include tambem nao tem equivalente no expect novo, para suprir:
                expect(user.toObject().tokens[1]).toMatchObject({
                        access:'auth',
                        token: res.headers['x-auth']
                })
                done();
            }).catch((e) => done(e));
        });
    });

    it('should reject invalid login', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: 'invalid one'
        })
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeFalsy();
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(1);
                done();
            }).catch((e) => done(e));
        });
    });
});

describe('DELETE /users/me/token', () => {
  it('Should remove auth token on logout', (done) => {
      request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
            return done(err);
        }

        User.findById(users[0]._id).then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
        }).catch((e) => done(e));
    });
  })
});