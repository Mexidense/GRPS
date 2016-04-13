module.exports = function(app){
	var CategoriasRiesgo = require('../models/categoriaRiesgos');

	//GET: Listar todos los elementos
	findAll = function (req, res){
	  CategoriasRiesgo.find(function (err, categoriaRiesgos) {
	    if(!err){
	    	res.send(categoriaRiesgos);
	    } 
		else {
			console.log('ERROR:' +err);
		}
	  });
	};
	//API Routes
	app.get('/categoriaRiesgos', findAll);

	//POST: Añadimos una lista de elementos
	addCategoriasRiesgo = function(req, res){
		var data = req.body;
   		
		var categoriaRiesgos = new CategoriasRiesgo({nombre: data.nombre});
		categoriaRiesgos.save(function(err){
		if(err) 
			console.log('ERROR:' +err);
		});

		res.send(data);
	};
	//API Routes
	app.post('/categoriaRiesgos', addCategoriasRiesgo);

	deleteAllCategoriasRiesgo = function(req, res){
		CategoriasRiesgo.collection.remove(function(err){
				if(err)
					console.log('ERROR: '+err);
			});
	}
	
	//API Routes
	app.delete('/categoriaRiesgos', deleteAllCategoriasRiesgo);


}