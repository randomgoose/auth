const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => { if (err) throw err });

const Schema = mongoose.Schema;

const documentSchema = new Schema({
    content: {type: String, required: true},
    author: String,
    timeCreated: Date
});

const userSchema = new Schema({
    username: {type: String, required: true},
    password: String,
    documents: [documentSchema],
    isLoggedIn: Boolean
});


const User = mongoose.model("User", userSchema);
const Document = mongoose.model("Document", documentSchema);
// const Document = mongoose.model("Document", documentSchema);

module.exports = {
    User,
    Document
}