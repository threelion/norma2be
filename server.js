var express = require('express');
var cors = require('cors');
var app = express();

var port     = process.env.PORT || 8080;
var bodyParser = require('body-parser');
var path = require('path');
var jwt = require('express-jwt')

// DB connection
var mongoose = require('mongoose');
var configDB = {
  'url' : 'mongodb://localhost/jwtauth'
};
mongoose.connect(configDB.url);

var corsOptions = {
  origin: 'http://localhost:4200'
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// API
var authBase = '/api/v1';
var pathBase = '/api/v1';
var apiBase = '/protected/api/v1';

// API route handlers
var users = require('.' + pathBase + '/users');
var index = require('.' + pathBase + '/index');
var countries = require('.' + pathBase + '/countries');
var producers = require('.' + pathBase + '/producers');
var units = require('.' + pathBase + '/units')
var products = require('.' + pathBase + '/products');
var groups = require('.' + pathBase + '/groups');
var consumers = require('.' + pathBase + '/consumers');
var taskStatus = require('.' + pathBase + '/taskStatus');
var taskTypes = require('.' + pathBase + '/taskTypes');
var tasks = require('.' + pathBase + '/tasks');
var files = require('.' + pathBase + '/files');
var multidata = require('.' + pathBase + '/multidata');
// var  = require('.' + pathBase + '/');
// var  = require('.' + pathBase + '/');
// var  = require('.' + pathBase + '/');
// var  = require('.' + pathBase + '/');
// var  = require('.' + pathBase + '/');
// var  = require('.' + pathBase + '/');
// var  = require('.' + pathBase + '/');
var productGroups = require('.' + pathBase + '/productGroups');

// API routes
app.use(cors(corsOptions));

app.use( apiBase, 
	jwt({
  	secret: 'my secret',
  	credentialRequired: false
  })
);

app.use(authBase + '/users', users); 

app.use(apiBase + '/welcome', index); 
app.use(apiBase + '/countries', countries); 
app.use(apiBase + '/producers', producers);   
app.use(apiBase + '/units', units); 
app.use(apiBase + '/products', products); 
app.use(apiBase + '/groups', groups); 
app.use(apiBase + '/consumers', consumers); 
app.use(apiBase + '/taskstatus', taskStatus); 
app.use(apiBase + '/tasktypes', taskTypes); 
app.use(apiBase + '/tasks', tasks); 
app.use(apiBase + '/files', files); 
app.use(apiBase + '/multidata', multidata); 
// app.use(apiBase + '/', ); 
// app.use(apiBase + '/', ); 
// app.use(apiBase + '/', ); 
// app.use(apiBase + '/', ); 
// app.use(apiBase + '/', ); 
// app.use(apiBase + '/', ); 
// app.use(apiBase + '/', ); 
// app.use(apiBase + '/', ); 
app.use(apiBase + '/productgroups', productGroups); 

app.listen(port);
console.info('Server listening on port: ' + port);