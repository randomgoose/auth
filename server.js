const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) {
          console.log('err'); 
          return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (user.password != password) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));

passport.serializeUser((user, done) => {
    console.log('Inside serializeUser callback. User id is save to the session file store here')
    console.log(user.id);
    done(null, user.id);
  });

passport.deserializeUser((username, done) => {
console.log('Inside deserializeUser callback')
User.findById(username, function(err, user) {
    done(err, user);
  });
});

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors({
    origin:['http://localhost:3000'],
    methods:['GET','POST'],
    credentials: true // enable set cookie
}));

app.use(session({
    genid: (req) => {
        return uuid();
    },
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (err) throw err;
});

const Schema = mongoose.Schema;
const userSchema = new Schema({
        username: {type: String, required: true},
        password: String,
        documents: [String]
});

const User = mongoose.model("User", userSchema);

app.get('/', (req, res) => {
    res.redirect('http://localhost:3000') 
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
    console.log(req.sessionID);
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        req.login(user, (err) => {
            if (err) { return next(err); }
            return res.json({
                "username": user.username,
                "documents": user.documents,
                "password": user.password,
            })
        })
    })(req, res, next);
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/')
})

app.get('/authrequired', (req, res) => {
    console.log('Inside GET /authrequired callback')
    console.log(req.sessionID);
    console.log(`User authenticated? ${req.isAuthenticated()}`)
    if(req.isAuthenticated()) {
      res.send('you hit the authentication endpoint\n')
    } else {
      res.redirect('/')
    }
  });

app.listen(5000, () => {
    console.log('listening on 5000');
});
