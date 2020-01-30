const model = require('./model');
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://randomgoose:Buccleuch123@cluster0-kxkb7.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
  // if (err) throw err;
  console.log('DB Connected.');
  if (err) throw err;
});

const User = model.User;
const Document = model.Document;
console.log(Document);
// const newUser = new User({
//     username: "yes",
//     password: "ss",
//     documents: [], 
//     isLoggedIn: false;
// }) 


const newDoc = new Document({
    _id: "uniqueid",
    content: "unique",
    author: "randomgoose",
    timeCreated: new Date()
})


// newDoc.save();
// newUser.save();
// let newDoc = new Document({
//     content: "Hi, there",
//     author: "randomgoose",
//     timeCreated: new Date()
// });
User.findOne({username: "gasgoose"}, (err, user) => {
    if (err) console.error(err);
    user.documents.push(newDoc);
    // console.log(user.documents);
    // user.documents.push(newDoc);
    // const doc = user.documents.id("5e2b3e37204c8c3fc1f3486a");
    console.log(user.documents);
    // doc.content = "changed!"
    user.save((err) => err);
});

// User.findOne({"documents._id": "5e2b3e37204c8c3fc1f3486a"}, (err, data) => {
//     if (err) console.error(err);
//     console.log(data);
// })

