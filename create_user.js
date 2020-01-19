const model = require('./model');
const mongoose = require('mongoose');


mongoose.connect("mongodb+srv://randomgoose:Buccleuch123@cluster0-kxkb7.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
  // if (err) throw err;
  console.log('DB Connected.');
  if (err) throw err;
});


const Message = mongoose.model('Message', {
  name: String,
  message: String
});

// function timeout(ms) {
//   return new Promise((resolve, reject) => {
//     setTimeout(resolve, ms, 'done')
//   });
// }

// timeout(1000).then((value) => {
//   console.log(value);
// })

// let DB_URI = "mongodb+srv://randsomgoose:Buccleuch123@cluster0-kxkb7.mongodb.net/test?retryWrites=true&w=majority";

// function connectDB(uri) {

//   return new Promise((resolve, reject) => {
//     resolve(mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}));
//   });

// }

mongoose.Promise = Promise;

// mongoose.connect(DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
//         .then(() => {
//           console.log('db')
//         })

Message.findOne({
  name: "Tim"
}).then((data) => {
  console.log(data);
}).catch((err) => {
  console.log(data);
})