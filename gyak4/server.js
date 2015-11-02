var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var Waterline = require('waterline');
var memoryAdapter = require('sails-memory');
var diskAdapter = require('sails-disk');
var postgresqlAdapter = require('sails-postgresql');

var indexRouter = require('./controllers/index');
var todoRouter = require('./controllers/todo');

var app = express();


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


//endpoints
app.use('/', indexRouter);
app.use('/todo', todoRouter);


var port = process.env.PORT || 3000;
app.listen(port);