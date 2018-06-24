const bcrypt = require('bcryptjs');

var password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//       console.log(hash);
//     });
// });

var hashedPassword = `$2a$10$B/SHKjHjeBHqH67zycVxMuQS/KMVrllnkVq6h22pZl86RfSC49fEe` ;

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});