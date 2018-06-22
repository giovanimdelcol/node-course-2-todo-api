const {SHA256} = require('crypto-js');

var message = 'I am user number 3';
var hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

var data = {
    id: 4
};

var token = {
    data: data,
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
}

//Person in the middle trying to generate a valid hash
token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();
//sem o somesecret ele nunca conseguira o mesmo token

var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

if (resultHash === token.hash) {
    console.log('data was not changed');
} else {
    console.log('Data was changed *DONT TRUST*')
}