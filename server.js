var express = require('express');
var mongoose = require('mongoose');
var bodyParser  = require("body-parser");
var methodOverride = require("method-override");

var app = express();

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());  
app.use(methodOverride());
app.use('/angular', express.static(__dirname + '/angular/'));
app.use(express.static(__dirname + '/views/'));

var router = express.Router();

app.use(router);

mongoose.connect( 'mongodb://localhost/grps' , function(err, res){
	if(err) console.log('Error: Conectando a la BD: ' + err);
	else console.log('Conexión a la BD realizada');
});


require('./controllers/usuario')(app);
require('./controllers/tipoSoftware')(app);
require('./controllers/categoriaRiesgos')(app);
require('./controllers/impactoRiesgo')(app);
require('./controllers/tipoUsuario')(app);
require('./controllers/riesgo')(app);
require('./controllers/proyecto')(app);


app.listen(80);
console.log('Servidor Express escuchando en el puerto 80');
