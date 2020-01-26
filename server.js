const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const cors = require('cors');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const model = require('./model');

// User model
const User = model.User;
const Document = model.Document;

// Configure Passport.js middleware
passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({
        username
    }).then((user) => {
        // User not registered
        if (!user) {
            return done(null, false, { message: 'User not registered' });
        }

        // Incorrect password
        if (user.password != password) {
            return done(null, false, { message: 'Incorrect password' });
        }

        // Authentication successful
        return done(null, user);
    }).catch((err) => {
        return done(err);
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

const app = express();

// Configure body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure Express Session middleware
app.use(session({
    genid: (req) => {
        return uuid();
    },
    store: new FileStore(),
    secret: 'random goose',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Use Cookie Parser
app.use(cookieParser());

// Use cors
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true // enable set cookie
}));

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post('/signup', (req, res) => {
    // Validate input
    User.findOne({
        username: req.body.username
    })
        .then((user) => {
            // User exists
            if (user) {

            }

            else {
                const newUser = new User({
                    username: req.body.username,
                    password: req.body.password,
                    documents: [],
                    isLoggedIn: false
                });

                newUser.save((err) => {
                    return err;
                })
            }
        })
        .catch((err) => {
            res.send(err);
        });

});

app.get('/login', (req, res) => {
    res.json({
        'info': 'none'
    });
});


app.post('/test', (req, res) => {
    res.json({ info: 'great' });
})

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        req.login(user, (err) => {
            if (err) {
                console.log(info);
                return next(err);
            }
            console.log(req.user);
            return res.send(user);
        });
    })(req, res, next);
});

app.post('/auth', (req, res) => {
    if (req.isAuthenticated()) {
        User.findById(req.user)
            .then((user) => {
                res.json(
                    {
                        isLoggedIn: true,
                        id: user.id,
                        documents: user.documents
                    }
                );
            })
    }
    else {
        res.json(
            { "isLoggedIn": false }
        );
    }
});

app.get('/auth', (req, res) => {
    if (req.isAuthenticated()) {
        User.findById(req.user)
            .then((user) => {
                res.json(
                    {
                        isLoggedIn: true,
                        id: user.id,
                        documents: user.documents
                    }
                );
            })
    }
    else {
        res.json(
            {
                isLoggedIn: false
            }
        );
    }
});

// Save Document end point
app.post('/save', (req, res) => {
    User.findById(req.user)
        .then((user) => {
            const document = user.documents.id(req.body.documentID);
            document.content = req.body.newContent;
            user.save((err) => console.error(err));
            res.json({
                "info": "Document saved!"
            })
        })
        .catch((err) => console.error(err));
});

// Add Document end point
app.get('/add', (req, res) => {
    if(req.isAuthenticated()){
        User.findById(req.user)
            .then((user) => {
                let newDoc = new Document({
                    content: "hi" + user.username,
                    author: user.username,
                    timeCreated: new Date()
                });

                user.documents.push(newDoc);
                user.save((err) => err);
                console.log(user)
            })
            .then(() => {
                res.json({"info": "yes"})
            })
            .catch(err => console.error(err));
    } else {
        console.log('no')
        res.json({"info": "no"})
    }
})


app.get('/logout', (req, res) => {
    req.logout();
    res.send("Logged out!");
})

app.listen(8080, () => {
    console.log('Listening on 8080...')
});