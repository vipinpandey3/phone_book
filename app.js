var bodyParser = require('body-parser');
var express = require('express');
var http = require('http');
var cors = require('cors');
var passport = require('passport');
const session = require('express-session');
require('./services/auth/authentication')(passport)
var models = require('./models')
var config = require('./config')

let app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json({
  limit: config.bodyParserLimit
}));
app.use(session({
  secret: 'your_secret_key', // Secret key used to sign the session ID cookie
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());

app.use('/', require('./routes/auth.route'));
app.use('/user', passport.authenticate('jwt', { session: false }), require('./routes/user.route'))


http.createServer(app).listen(config.SERVER_PORT);
console.log('App initialized ON db port ' + config.DB_PORT);
console.log('App initialized and listening on port ' + config.SERVER_PORT);

process.on('SIGINT', function () {
  console.log('Stopping all cronjobs');
  process.exit();
});