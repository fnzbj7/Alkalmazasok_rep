var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var Waterline = require('waterline');
var postgresqlAdapter = require('sails-postgresql');

var indexRouter = require('./controllers/index');
var todoRouter = require('./controllers/todo');
var loginRouter = require('./controllers/login');

var waterlineConfig = require('./config/waterline');
var todoCollection = require('./models/todo');
var userCollection = require('./models/user');

var app = express();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


// Local Strategy for sign-up
passport.use('local-signup', new LocalStrategy({
        usernameField: 'neptun',
        passwordField: 'password',
        passReqToCallback: true,
    },   
    function(req, neptun, password, done) {
        req.app.models.user.findOne({ neptun: neptun }, function(err, user) {
            if (err) { return done(err); }
            if (user) {
                return done(null, false, { message: 'Létező neptun.' });
            }
            req.app.models.user.create(req.body)
            .then(function (user) {
                return done(null, user);
            })
            .catch(function (err) {
                return done(null, false, { message: err.details });
            })
        });
    }
));

// Stratégia
passport.use('local', new LocalStrategy({
        usernameField: 'neptun',
        passwordField: 'password',
        passReqToCallback: true,
    },
    function(req, neptun, password, done) {
        req.app.models.user.findOne({ neptun: neptun }, function(err, user) {
            if (err) { return done(err); }
            if (!user || !user.validPassword(password)) {
                return done(null, false, { message: 'Helytelen adatok.' });
            }
            return done(null, user);
        });
    }
));

// Middleware segédfüggvény
function setLocalsForLayout() {
    return function (req, res, next) {
        res.locals.loggedIn = req.isAuthenticated();
        res.locals.user = req.user;
        next();
    }
}
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}
function andRestrictTo(role) {
    return function(req, res, next) {
        if (req.user.role == role) {
            next();
        } else {
            console.log(req.user.role);
            res.redirect('/login');
            //next(new Error('Unauthorized'));
        }
    }
}


//Model layer
var errorContainer = [];



//config
app.set('views', './views');
app.set('view engine', 'hbs');


//middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'titkos szoveg',
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(setLocalsForLayout());


//endpoints
app.use('/', indexRouter);
app.use('/todo', todoRouter);
app.use('/login', loginRouter);

app.get('/operator', ensureAuthenticated, andRestrictTo('operator'), function(req, res) {
    res.end('operator');
});

app.get('/user', ensureAuthenticated, andRestrictTo('riporter'), function(req, res) {
     res.redirect('/');
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


// ORM példány
var orm = new Waterline();
orm.loadCollection(Waterline.Collection.extend(todoCollection));
orm.loadCollection(Waterline.Collection.extend(userCollection));


// ORM indítása
orm.initialize(waterlineConfig, function(err, models) {
    if(err) throw err;
    
    app.models = models.collections;
    app.connections = models.connections;
    
    // Start Server
    var port = process.env.PORT || 3000;
    app.listen(port, function () {
        console.log('Server is started.');
    });
    console.log("ORM is started.");
});