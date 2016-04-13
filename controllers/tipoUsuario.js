module.exports = function(app){
	var TiposUsuario = require('../models/tipoUsuario');

	//GET: Listar todos los elementos
	findAll = function (req, res){
	  TiposUsuario.find(function (err, tipoUsuario) {
	    if(!err){
	    	res.send(tipoUsuario);
	    } 
		else {
			console.log('ERROR:' +err);
		}
	  });
	};
	//API Routes
	app.get('/tipoUsuario', findAll);

	//POST: Añadimos una lista de elementos
	addTiposUsuario = function(req, res){
		var data = req.body;
		var tipoUsuario = new TiposUsuario({nombre: data.nombre});
		tipoUsuario.save(function(err){
		if(err) 
			console.log('ERROR:' +err);
		});
		res.send(data);
	};
	//API Routes
	app.post('/tipoUsuario', addTiposUsuario);

	deleteAllTiposUsuario = function(req, res){
		TiposUsuario.collection.remove(function(err){
			if(err)
				console.log('ERROR: '+err);
		});
	}
	
	//API Routes
	app.delete('/tipoUsuario', deleteAllTiposUsuario);


}