var express = require('express');
var app = express();
var path = require('path');
var router = require('./router.js');
var bodyParser = require('body-parser');
var session = require('express-session');

//配置express-session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    //无论你是否使用session，默认给你个参数
    saveUninitialized: true
}));

app.use('/public/', express.static(path.join(__dirname, '/public/')));
app.use('/node_modules/', express.static(path.join(__dirname, '/node_modules/')));
// app.use('/public/', express.static('./public/'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.engine('html', require('express-art-template'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(router);


app.listen(5000, function(err) {
    if (err) {
        return console.log('error');
    }
    console.log('server is running');
});