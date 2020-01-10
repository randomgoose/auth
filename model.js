const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, required: true},
    password: String,
    documents: [String],
    isLoggedIn: Boolean
});

// const fileSchema = new Schema({
//     title: String
// })

const User = mongoose.model("User", userSchema);

module.exports = {
    User: User
} 