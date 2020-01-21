const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => { if (err) throw err });

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, required: true},
    password: String,
    documents: [String],
    isLoggedIn: Boolean
});

const User = mongoose.model("User", userSchema);

module.exports.User = User;