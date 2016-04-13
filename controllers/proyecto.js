module.exports = function(app){
	var Proyecto = require("../models/proyecto");

	//GET: Listar todos los elementos
	findAll = function (req, res){
	  Proyecto.find(function (err, proyectos) {
	    if(!err){
	    	res.send(proyectos);
	    } 
		else {
			console.log('ERROR:' +err);
		}
	  });
	};

	//GET: Mostrar un elemento
	findByID = function(req, res){
		Proyecto.findById(req.params.id, function(err, proyecto){
			if(!err) 
				res.send(proyecto);
			else 
				console.log('ERROR:' +err);
		});
	};

	//API Routes
	app.get('/proyecto', findAll);
	app.get('/proyecto/:id', findByID);

	//POST: Añadir proyecto
	addProyecto = function(req, res){
		var proyecto = new Proyecto({
			nombre: req.body.nombre,
			tipoProyecto: req.body.tipoProyecto,
			descripcion: req.body.descripcion,
			fechaInicio: req.body.fechaInicio,
			fechaFin: req.body.fechaFin,
			riesgoPorDebajoCorte: req.body.riesgoPorDebajoCorte,
		});
		
		req.body.listaRiesgos.forEach(function (item) {
			proyecto.listaRiesgos.push(item);
		});
		req.body.listaUsuarios.forEach(function (item) {
			proyecto.listaUsuarios.push(item);
		});
		
		proyecto.save(function(err){
			if(err)
				console.log('ERROR:' +err);
		});

		res.send(proyecto);
	};
	//API Routes
	app.post('/proyecto', addProyecto);

	//PUT: Actualizar proyectos
	updateProyecto = function(req, res){
		Proyecto.findById(req.params.id, function(err, proyecto){
			proyecto.nombre = req.body.nombre;
			proyecto.tipoProyecto = req.body.tipoProyecto;
			proyecto.descripcion = req.body.descripcion;
			proyecto.fechaInicio = req.body.fechaInicio;
			proyecto.fechaFin = req.body.fechaFin;
			proyecto.riesgoPorDebajoCorte = req.body.riesgoPorDebajoCorte;

			//Sacamos todos sus riesgos
			proyecto.listaRiesgos = [];
			//Insertamos los nuevos riesgos
			req.body.listaRiesgos.forEach(function(item){
				proyecto.listaRiesgos.push(item);
			});

			//Sacamos todos los usuarios
			proyecto.listaUsuarios = [];
			//Insertamos todos los nuevos usuarios
			req.body.listaUsuarios.forEach(function (item) {
				proyecto.listaUsuarios.push(item);
			});

			proyecto.save(function(err){
				if(err)
					console.log('ERROR: '+err);
				else
					res.send(proyecto);
			});
		});
	};
	//API Routes
	app.put('/proyecto/:id', updateProyecto);

	//DELETE: Eliminar un proyecto según su id
	deleteProyecto = function(req, res){
		Proyecto.findById(req.params.id, function(err, proyecto){
			proyecto.remove(function(err){
				if(err)
					console.log('ERROR: '+err);
			})
		});
	}
	//API Routes
	app.delete('/proyecto/:id', deleteProyecto);
};