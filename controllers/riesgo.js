module.exports = function(app){
	var Riesgo = require('../models/riesgo');

	//GET: Listar todos los elementos
	findAll = function (req, res){
	  Riesgo.find(function (err, riesgos) {
	    if(!err){
	    	res.send(riesgos);
	    } 
		else {
			console.log('ERROR:' +err);
		}
	  });
	};

	//GET: Mostrar un elemento
	findByID = function(req, res){
		Riesgo.findById(req.params.id, function(err, riesgo){
			if(!err) 
				res.send(riesgo);
			else 
				console.log('ERROR:' +err);
		});
	};
	
	//API Routes
	app.get('/riesgo', findAll);
	app.get('/riesgo/:id', findByID);
	
	//POST: Añadir un riesgo
	addRiesgo = function(req, res){
		var riesgo = new Riesgo({
			nombre: req.body.nombre,
			categoriaRiesgo: req.body.categoriaRiesgo,
			impactoRiesgo: req.body.impactoRiesgo,
			tipoRiesgo: req.body.tipoRiesgo,
			descripcion: req.body.descripcion,
			factores: req.body.factores,
			reduccion: req.body.reduccion,
			supervision: req.body.supervision
		});

		riesgo.save(function(err){
			if(err)
				console.log('ERROR:' +err);
		});

		res.send(riesgo);
	};
	//API Routes
	app.post('/riesgo', addRiesgo);
	
	//PUT: Actualizar riesgos
	updateRiesgo = function(req, res){
		Riesgo.findById(req.params.id, function(err, riesgo){
			riesgo.nombre = req.body.nombre;
			riesgo.categoriaRiesgo = req.body.categoriaRiesgo;
			riesgo.impactoRiesgo = req.body.impactoRiesgo;
			riesgo.tipoRiesgo = req.body.tipoRiesgo;
			riesgo.descripcion = req.body.descripcion;
			riesgo.factores = req.body.factores;
			riesgo.reduccion = req.body.reduccion;
			riesgo.supervision = req.body.supervision;

			riesgo.save(function(err){
				if(err)
					console.log('ERROR: '+err);
			})
		});
	};
	//API Routes
	app.put('/riesgo/:id', updateRiesgo);

	//DELETE: Eliminar riesgos
	deleteRiesgo = function(req, res){
		Riesgo.findById(req.params.id, function(err, riesgo){
			riesgo.remove(function(err){
				if(err)
					console.log('ERROR: '+err);
			})
		});
	};
	//API Routes
	app.delete('/riesgo/:id', deleteRiesgo);
	//DELETE: Eliminar todos los riesgos
	deleteAllRiesgos = function(req, res){
		Riesgo.collection.remove(function(err){
				if(err)
					console.log('ERROR: '+err);
			});
	};
	
	//API Routes
	app.delete('/riesgo', deleteAllRiesgos);

	
}