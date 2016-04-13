module.exports = function(app){
	var Usuarios = require('../models/usuario');

	//GET: Listar todos los elementos
	findAll = function (req, res){
	  Usuarios.find(function (err, usuarios) {
	    if(!err){
	    	res.send(usuarios);
	    } 
		else {
			console.log('ERROR:' +err);
		}
	  });
	};

	//GET: Mostrar un elemento
	findByID = function(req, res){
		Usuarios.findById(req.params.id, function(err, usuarios){
			if(!err) 
				res.send(usuarios);
			else 
				console.log('ERROR:' +err);
		});
	};
	
	//API Routes
	app.get('/usuarios', findAll);
	app.get('/usuarios/:id', findByID);
	
	//POST: Añadir usuario
	addUser = function(req, res){
		var usuarios = new Usuarios({
			nombre: req.body.nombre,
			email: req.body.email,
			pass: req.body.pass,
			tipo: req.body.tipo
		});

		usuarios.save(function(err){
			if(err)
				console.log('ERROR:' +err);
		});

		res.send(usuarios);
	};
	//API Routes
	app.post('/usuarios', addUser);
	
	//PUT: Actualizar usuarios
	updateUser = function(req, res){
		Usuarios.findById(req.params.id, function(err, usuarios){
			usuarios.nombre = req.body.nombre,
			usuarios.email = req.body.email;
			usuarios.pass = req.body.pass;
			usuarios.tipo = req.body.tipo;

			usuarios.save(function(err){
				if(err)
					console.log('ERROR: '+err);
		})
		});
	};
	//API Routes
	app.put('/usuarios/:id', updateUser);

	//DELETE: Eliminar usuarios
	deleteUser = function(req, res){
		Usuarios.findById(req.params.id, function(err, usuario){
			usuario.remove(function(err){
				if(err)
					console.log('ERROR: '+err);
			})
		});
	}
	//API Routes
	app.delete('/usuarios/:id', deleteUser);

	deleteAllUser = function(req, res){
		Usuarios.collection.remove(function(err){
				if(err)
					console.log('ERROR: '+err);
			});
	}
	
	//API Routes
	app.delete('/usuarios', deleteAllUser);

	
}