var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var authMiddleware = require('./middlewares/auth');
var cors = require('cors');
var index = require('./routes/index');


//querys 
let db = require('./querys');

//inicializa el socket 
const io = require('socket.io')();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//permite el servicio cors, agregando las cabaceras necesarias a las respuestas 
app.use(cors())
app.use('/', index);
app.use(authMiddleware);
app.post('/my-profile', function(req, res) {
    console.log(`decode ${req.decoded.userId}`);
    db.any('SELECT name,email,id  FROM "user" WHERE id=$1', [req.decoded.userId])
        .then((data) => {
            if (data.length === 0) {
                return res.status(401)
            } else {
                let user = Object.assign({}, data[0]);
                res.status(200).json(user);
            }

        }).catch((err) => {
            console.error(err);
            return res.status(500).json({ error: "server error" });

        });

});

let users = {};
io.on('connection', (client) => {
    // here you can start emitting events to the client

    client.on('connect-to-chat', (user) => {
        //retorna oobjeto con usuarios conectados al chat
        client.emit('users-connected', users);
        //almacena usuario
        users[client.id] = user;
        //emite a los otros usuarios que un nuevo usuario se ha conectado
        client.broadcast.emit('new-user-connected', {
            [client.id]: user
        });


    })
    client.on('disconnect', () => {
        io.broadcast.emit('user-disconnected', client.id)
        delete users[client.id]
        console.log('USUARIO DESCONECTADO');
        console.log(users);

    })


});


const port = 8000;
io.listen(port);
console.log('socket listening on port ', port);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;