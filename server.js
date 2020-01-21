const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
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
    done(null, user.id);
  });

passport.deserializeUser((username, done) => {
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

app.use(cookieParser());

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (err) throw err;
});

const Schema = mongoose.Schema;
const userSchema = new Schema({
        username: {type: String, required: true},
        password: String,
        documents: [String],
        isLoggedIn: Boolean
});

const User = mongoose.model("User", userSchema);

app.get('/', (req, res) => {
    // res.redirect('/') 
    res.json({
      name: 'hi'
    })
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
    console.log(req.sessionID);
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        req.login(user, (err) => {
            if (err) { return next(err); }
            User.findByIdAndUpdate(user.id, { isLoggedIn: true}, (err, user) => {
              if (err) return err;
            })
            return res.json({
                "id": user.id,
                "documents": user.documents
            })
        })
    })(req, res, next);
});

app.get('/logout', (req, res) => {
  User.findByIdAndUpdate(req.user.id, { isLoggedIn: false }, (err, user) => {
    if (err) return err;
  });
  req.logout();
  res.redirect('/')
})

app.get('/authrequired', (req, res) => {
    
    // console.log('Inside GET /authrequired callback')
    // console.log(req.sessionID);
    // console.log(`User authenticated? ${req.isAuthenticated()}`)
    if(req.isAuthenticated()) {
      res.send('you hit the authentication endpoint\n' + String(req.user))
    } else {
      res.redirect('/')
    }
  });


app.post('/authrequired', (req, res) => {
  console.log("sessionID", req.sessionID);
  res.send(req.sessionID);
  // User.findById(req.body.id, (err, user) => {
  //   if (user.isLoggedIn === true) {
  //     res.json({
  //       isLoggedIn: true,
  //       documents: user.documents
  //     })
  //   }
  // })
});

app.listen(5000, () => {
    console.log('listening on 5000');
});
 