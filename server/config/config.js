var env = process.env.NODE_ENV || 'development'; //only exist in heroku

if (env === 'development'  || env === 'test') {
  var config = require('./config.json');
  var envConfig = config[env];
//abaixo o metodo keys retorna um vetor com as propriedades
//do objeto. Para cada propriedade nos setaremos
//uma variavel de ambiente com o mesmo valor de config.

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}

// if (env === 'development'){
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test'){
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }