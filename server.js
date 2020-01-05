const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');

const users = [
    {id: '2f24vvg', username: 'test', password: 'password'}
  ]

passport.use(new LocalStrategy({usernameField: 'username'}, (username, password, done) => {
    console.log('passport use');
    console.log(username + password);
    const user = users[0];
    if (username == user.username && password == user.password) {
        return done(null, user);
    }
    else {
        return done(null, false, {message: "incorrect password"})
    }
}));

passport.serializeUser((user, done) => {
    console.log('Inside serializeUser callback. User id is save to the session file store here')
    console.log(user);
    done(null, user.id);
  });

passport.deserializeUser((id, done) => {
console.log('Inside deserializeUser callback')
console.log(`The user id passport saved in the session file store is: ${id}`)
const user = users[0].id === id ? users[0] : false; 
done(null, user);
});

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors());

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
app.use(passport.session())

app.get('/', (req, res) => {
    res.json({"name": "s"});
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
    console.log(req.sessionID);
});

app.post('/login', (req, res, next) => {
    // console.log('yes');
    // console.log(JSON.stringify(req.user));
    passport.authenticate('local', (err, user, info) => {
        // req.login(user, (err) => {
        //     if (err) { return next(err); }
        //     return res.json({
        //         "login": "yes!"
        //     })
        // })
        // // res.json(req.body);
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, function(err) {
             if (err) { return next(err); }
             return res.json({
                        "login": "yes!"
                    })
         });
    })(req, res, next);
});

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
    console.log('listening on 3000');
});
