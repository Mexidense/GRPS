module.exports = function(app){
	var TiposSoftware = require('../models/tipoSoftware');

	//GET: Listar todos los elementos
	findAll = function (req, res){
	  TiposSoftware.find(function (err, tipoSoftware) {
	    if(!err){
	    	res.send(tipoSoftware);
	    } 
		else {
			console.log('ERROR:' +err);
		}
	  });
	};
	//API Routes
	app.get('/tipoSoftware', findAll);

	//POST: Añadimos una lista de elementos
	addTipoSoftware = function(req, res){
		var data = req.body;

   		//data.forEach(function (item) {
   			var tipoSoftware = new TiposSoftware({nombre: data.nombre});
       		tipoSoftware.save(function(err){
			if(err) 
				console.log('ERROR:' +err);
			});

   		//});
		res.send(data);
	};
	//API Routes
	app.post('/tipoSoftware', addTipoSoftware);

	deleteAllTiposSoftware = function(req, res){
		TiposSoftware.collection.remove(function(err){
				if(err)
					console.log('ERROR: '+err);
			});
	}
	
	//API Routes
	app.delete('/tipoSoftware', deleteAllTiposSoftware);


}