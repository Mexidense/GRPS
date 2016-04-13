module.exports = function(app){
	var ImpactosRiesgo = require('../models/impactoRiesgo');

	//GET: Listar todos los elementos
	findAll = function (req, res){
	  ImpactosRiesgo.find(function (err, impactoRiesgo) {
	    if(!err){
	    	res.send(impactoRiesgo);
	    } 
		else {
			console.log('ERROR:' +err);
		}
	  });
	};
	//API Routes
	app.get('/impactoRiesgo', findAll);

	//POST: Añadimos una lista de elementos
	addImpactosRiesgo = function(req, res){
		var data = req.body;
   		
		var impactoRiesgo = new ImpactosRiesgo({nombre: data.nombre});
		impactoRiesgo.save(function(err){
		if(err) 
			console.log('ERROR:' +err);
		});

		res.send(data);
	};
	//API Routes
	app.post('/impactoRiesgo', addImpactosRiesgo);

	deleteAllImpactosRiesgo = function(req, res){
		ImpactosRiesgo.collection.remove(function(err){
				if(err)
					console.log('ERROR: '+err);
			});
	}
	
	//API Routes
	app.delete('/impactoRiesgo', deleteAllImpactosRiesgo);


}