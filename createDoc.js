const model = require('./model');
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://randomgoose:goose123@localhost/users", {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
  // if (err) throw err;
  console.log('DB Connected.');
  if (err) throw err;
});

const User = model.User;
const Document = model.Document;
console.log(Document);
 const newUser = new User({
     username: "solidgoose",
     password: "goose123",
     documents: [], 
     isLoggedIn: false
 }) 

newUser.save((err) => console.log(err));

// const newDoc = new Document({
//     _id: "uniqueid",
//     content: "unique",
//     author: "randomgoose",
//     timeCreated: new Date()
// })


// newDoc.save();
// newUser.save();
// let newDoc = new Document({
//     content: "Hi, there",
//     author: "randomgoose",
//     timeCreated: new Date()
// });
//User.findOne({username: "gasgoose"}, (err, user) => {
//    if (err) console.error(err);
//    user.documents.pull("5e362bba04bc119b616f5f43");
//    user.save()
    // Document.deleteOne({content: "toDelete"})
    //         .then(() => user.save())
    // console.log(user.documents);
    // user.documents.push(newDoc);
    // const doc = user.documents.id("5e2b3e37204c8c3fc1f3486a");
    // console.log(user.documents);
    // doc.content = "changed!"
    // user.save((err) => err);
// });

// User.findOne({"documents._id": "5e2b3e37204c8c3fc1f3486a"}, (err, data) => {
//     if (err) console.error(err);
//     console.log(data);
// })

