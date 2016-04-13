var app = angular.module("GestionProyectos", ["ui.bootstrap", "ngRoute","ngCookies"]);

app.controller("GestionProyectosController", function($scope, $http, $window, $uibModal,$cookieStore){
	$scope.mensajeWarning = false;
	$scope.mensajeSuccess =  false;
	$scope.mensaje = "";
	$scope.listaRiesgos = [];
	$scope.listaRiesgosPredefinidos = [];
	$scope.listaRiesgosParaAnadir = [];
	$scope.listaRiesgosLineaCorte = [];
	$scope.mensajeLineaCorte="Línea de corte por establecer";
	$scope.riesgoPorDebajoCorte = -1;
	$scope.probabilidades = [5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95];
	$scope.listaTodosUsuarios = [];
	$scope.listaUsuariosSeleccionados = [];
	
	$http.get('/proyecto').success(function(data) {
		$scope.proyectos = data;

		//Mostrarmos los proyectos de un usuario
		$scope.listaProyectosUsuario = [];
		var usuario = $cookieStore.get("usuarioRegistrado");
		$scope.nombreUsuario = usuario.nombre;
		if(usuario != undefined){
			for (var i=0; i<$scope.proyectos.length; i++) {
				for (var j=0; j<$scope.proyectos[i].listaUsuarios.length; j++) {
					//console.log($scope.proyectos[i].listaUsuarios[j].idUsuario +"-"+ usuario._id);
					if($scope.proyectos[i].listaUsuarios[j].idUsuario == usuario._id){
						$scope.listaProyectosUsuario.push($scope.proyectos[i]);
						break;
					}
				}
			};
		}
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});

	$scope.irRegistrarProyecto = function(){
		$window.location.href = '/crearProyecto.html';
	};

	//Cargamos los predefinidos
	$http.get('/tipoSoftware').success(function(data) {
		$scope.tipoProyecto = [];

		data.forEach(function (item) {
			$scope.tipoProyecto.push(String(item.nombre));
		});
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});
	//Cargamos todos los riesgos...
	$http.get('/riesgo').success(function(data) { 
			$scope.listaRiesgosPredefinidos = data;
			for(var i=0; i<$scope.listaRiesgosPredefinidos.length;i++){
				$scope.listaRiesgosPredefinidos[i].idRiesgo = $scope.listaRiesgosPredefinidos[i]._id;
			}
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});
	//Cargamos todos los usuarios...
	$http.get('/usuarios').success(function(data) {
		$scope.listaTodosUsuarios = data;
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});

	$scope.cargarListadoPredefinidos = function(){
		$scope.listaRiesgosParaAnadir = [];
		$scope.mensajeLineaCorte = "";
		for (var i=0; i<$scope.listaRiesgosPredefinidos.length; i++) {
			var coincidencia = false;
			for (var j=0; j<$scope.listaRiesgos.length;j++) {
				if($scope.listaRiesgosPredefinidos[i]._id == $scope.listaRiesgos[j]._id || 
					$scope.listaRiesgosPredefinidos[i]._id == $scope.listaRiesgos[j].idRiesgo){
					coincidencia = true;
					break;
				}
			};
			if(!coincidencia)
				$scope.listaRiesgosParaAnadir.push($scope.listaRiesgosPredefinidos[i]);
		};
	};
	$scope.comprobarProbabilidad = function(option, valor){
		return (parseInt(option) == parseInt(valor));
	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////Metodos que invocan a los modales para cargar riesgos y establecer línea de corte
	/////////////////////////////////////////////////////////////////////////////
	$scope.modalCargarRiesgos = function(){
		$scope.cargarListadoPredefinidos();
		var modalInstance = $uibModal.open({
	      templateUrl: 'modalCargarRiesgos.html',
	      controller: 'modalCargarRiesgosController',
	      scope: $scope,
	      size: 'lg'
	    });
	}
	
	$scope.modalEstablecerLineaCorte = function(){	
		var modalInstance = $uibModal.open({
			templateUrl: 'modalEstablecerLineaCorte.html',
			controller: 'modalEstablecerLineaCorteController',
			scope: $scope,
			size: 'lg'
	    });
    };
    $scope.irModalBorrado = function(proyecto){
		$scope.proyectoABorrar = proyecto;
		var modalInstance = $uibModal.open({
	      templateUrl: 'modalBorrar.html',
	      controller: 'modalBorrarController',
	      scope: $scope
	    });
	};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////Metodos que invocan a los modales para modificar y eliminar proyectos
/////////////////////////////////////////////////////////////////////////////
	$scope.irModalModificar = function(proyecto){
		$scope.proyectoAModificar = proyecto;
		$scope.proyectoAModificar.fechaInicio = new Date($scope.proyectoAModificar.fechaInicio);
		$scope.proyectoAModificar.fechaFin = new Date($scope.proyectoAModificar.fechaFin);
		//Filtrar los usuarios del proyecto
		for(var i=0; i<$scope.listaTodosUsuarios.length;i++){
			for(var j=0; j<$scope.proyectoAModificar.listaUsuarios.length;j++){
				var usuarioIDListaTodosUsuarios = String($scope.listaTodosUsuarios[i]._id);
				var usuarioIDListaProyectoAModificar = 	String($scope.proyectoAModificar.listaUsuarios[j].idUsuario);
				//console.log(usuarioIDListaTodosUsuarios);
				if(usuarioIDListaTodosUsuarios == usuarioIDListaProyectoAModificar){
					//console.log("Usuario encontrado: "+usuarioIDListaProyectoAModificar);
					$scope.listaTodosUsuarios[i].seleccionado = true;
					break;
				}
			}
		}
		//Filtrar los riesgos que podemos añadir:
		$scope.listaRiesgosParaAnadir = [];
		//$scope.listaRiesgos = $scope.proyectoAModificar.listaRiesgos;
		$scope.listaRiesgos = [];
		for (var i=0; i<$scope.proyectoAModificar.listaRiesgos.length; i++) {
			for (var j=0; j<$scope.listaRiesgosPredefinidos.length; j++) {
				if($scope.proyectoAModificar.listaRiesgos[i].idRiesgo == $scope.listaRiesgosPredefinidos[j]._id){
					$scope.listaRiesgos.push({
						idRiesgo:  $scope.proyectoAModificar.listaRiesgos[i].idRiesgo,
						probabilidad: $scope.proyectoAModificar.listaRiesgos[i].probabilidad,
						nombre: $scope.listaRiesgosPredefinidos[j].nombre,
						categoriaRiesgo: $scope.listaRiesgosPredefinidos[j].categoriaRiesgo,
						impactoRiesgo: $scope.listaRiesgosPredefinidos[j].impactoRiesgo,
						tipoRiesgo: $scope.listaRiesgosPredefinidos[j].tipoRiesgo,
						descripcion: $scope.listaRiesgosPredefinidos[j].descripcion,
						factores: $scope.listaRiesgosPredefinidos[j].factores,
						reduccion: $scope.listaRiesgosPredefinidos[j].reduccion,
						supervision: $scope.listaRiesgosPredefinidos[j].supervision
					});
					break;
				}
			};
		};
		$scope.listaRiesgos.sort(function(a, b) {
    		return parseInt(b.probabilidad) - parseInt(a.probabilidad);
		});
		var modalInstance = $uibModal.open({
	      templateUrl: 'modalModificar.html',
	      controller: 'modalModificarController',
	      scope: $scope,
	      size: 'lg'
	    });
	}

    $scope.comprobarFecha = function(inicio, fin){
    	var diaI = inicio.getDate();
    	var mesI = inicio.getMonth();
    	var anoI = inicio.getFullYear();
    	//console.log(diaI+"-"+mesI+"-"+anoI);
    	var diaF = fin.getDate();
    	var mesF = fin.getMonth();
    	var anoF = fin.getFullYear();
    	//console.log(diaF+"-"+mesF+"-"+anoF);
    	if(anoI<anoF)
    		return true;
    	else if(anoI==anoF){
    		if(mesI<mesF)
    			return true;
    		else if(mesI==mesF){
    			if(diaI<diaF)
    				return true;
    			else
    				return false;
    		}
    		else
    			return false
    	}
    	else
    		return false;
    	
    };

    $scope.formatearFecha = function(fecha){
    	return new Date(fecha).toLocaleDateString();
    };

    $scope.registrarProyecto = function(){
    	$scope.nuevoProyectoASubir = {};
    	$scope.nuevoProyectoASubir.nombre = $scope.nuevoProyecto.nombre;
		$scope.nuevoProyectoASubir.tipoProyecto = $scope.nuevoProyecto.tipoProyecto;
		$scope.nuevoProyectoASubir.descripcion = $scope.nuevoProyecto.descripcion;
		$scope.nuevoProyectoASubir.fechaInicio = new Date($scope.nuevoProyecto.fechaInicio);
		$scope.nuevoProyectoASubir.fechaFin = new Date($scope.nuevoProyecto.fechaFin);
		$scope.nuevoProyectoASubir.listaRiesgos = [];
		for (var i=0; i<$scope.listaRiesgos.length;i++) {
    		$scope.nuevoProyectoASubir.listaRiesgos.push({
    			idRiesgo: $scope.listaRiesgos[i]._id,
    			probabilidad: $scope.listaRiesgos[i].probabilidad
    		});
    	};
    	$scope.nuevoProyectoASubir.listaUsuarios = [];
    	for (var i=0; i<$scope.listaTodosUsuarios.length;i++) {
    		if($scope.listaTodosUsuarios[i].seleccionado)
    			$scope.nuevoProyectoASubir.listaUsuarios.push({
    				idUsuario: $scope.listaTodosUsuarios[i]._id
    			});
    	};
    	//console.log(JSON.stringify($scope.nuevoProyectoASubir));

    	if($scope.comprobarFecha($scope.nuevoProyecto.fechaInicio,$scope.nuevoProyecto.fechaFin)){
    		$http.post('/proyecto', $scope.nuevoProyectoASubir)
			.success(function(data) {
				$scope.nuevoProyecto = {}; // Borramos los datos del formulario
				$scope.listaRiesgos = [];
				$scope.listaRiesgosPredefinidos = [];
				$scope.listaRiesgosParaAnadir = [];
				$scope.listaRiesgosLineaCorte = [];
				$scope.mensajeLineaCorte="Línea de corte por establecer";
				$scope.riesgoPorDebajoCorte = -1;

				$scope.mensajeWarning = false;
				$scope.mensajeSuccess =  true;
				$scope.mensaje = "Proyecto creado con exito";
				javascript:window.history.back();
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
    	}
    	else{
    		$scope.mensajeSuccess =  false;
    		$scope.mensajeWarning = true;
    		$scope.mensaje = "La fecha de inicio debe ser menor a la fecha de fin";
    	}
    	
    };

    $scope.volver = function(){
    	/*if($scope.administrador)
			$window.location.href = '/gestionProyectos.html'
		if($scope.registrado)
			$window.location.href = '/proyectos.html'*/
		javascript:window.history.back();
    };

    ///////////////////////////////////////////Para roles de acceso//////////////////////////////////////////////
	var usuario = $cookieStore.get("usuarioRegistrado");
	if(usuario == undefined){
		$scope.invitado = true;
		$scope.registrado =  false;
		$scope.administrador = false;
	}
	else{
			if(usuario.tipo=="Estandar"){
			$scope.invitado = false;
			$scope.registrado =  true;
			$scope.administrador = false;
		}
		else if(usuario.tipo=="Administrador"){
			$scope.invitado = false;
			$scope.registrado =  false;
			$scope.administrador = true;
		}
		//console.log(usuario.tipo);
	}
    
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////Controladores para los modales de cargar riesgos y establecer linea de corte////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.controller("modalCargarRiesgosController", function($scope, $uibModal, $uibModalInstance, $http, $window){
	// console.log("LISTA RIESGOS PARA AÑADIR");
	// for(var i=0; i<$scope.listaRiesgosParaAnadir.length; i++){
	// 	console.log($scope.listaRiesgosParaAnadir[i]);
	// }
	// console.log("LISTA RIESGOS EN EL PROYECTO");
	// for(var i=0; i<$scope.listaRiesgos.length; i++){
	// 	console.log($scope.listaRiesgos[i]);
	// }

	$scope.insertarRiesgoAProyecto = function(index, riesgo){
		$scope.listaRiesgos.push(riesgo);


		for(var i=0; i<$scope.listaRiesgosParaAnadir.length; i++){
			if($scope.listaRiesgosParaAnadir[i].idRiesgo == riesgo.idRiesgo){
				$scope.listaRiesgosParaAnadir.splice(index, 1);
				break;
			}
		}

		// console.log("LISTA RIESGOS PARA AÑADIR");
		// for(var i=0; i<$scope.listaRiesgosParaAnadir.length; i++){
		// 	console.log($scope.listaRiesgosParaAnadir[i]);
		// }
		// console.log("LISTA RIESGOS EN EL PROYECTO");
		// for(var i=0; i<$scope.listaRiesgos.length; i++){
		// 	console.log($scope.listaRiesgos[i]);
		// }
	};

	$scope.descartarRiesgoEnProyecto = function(index, riesgo){
		$scope.listaRiesgosParaAnadir.push(riesgo);

		/*$scope.listaRiesgos.sort(function(a, b) {
    		return parseInt(b.probabilidad) - parseInt(a.probabilidad);
		});*/
		for(var i=0; i<$scope.listaRiesgos.length; i++){
			if($scope.listaRiesgos[i].idRiesgo == riesgo.idRiesgo){
				$scope.listaRiesgos.splice(index, 1);
				break;
			}
		}

/*
		console.log("LISTA RIESGOS PARA AÑADIR");
		for(var i=0; i<$scope.listaRiesgosParaAnadir.length; i++){
			console.log($scope.listaRiesgosParaAnadir[i]);
		}
		console.log("LISTA RIESGOS EN EL PROYECTO");
		for(var i=0; i<$scope.listaRiesgos.length; i++){
			console.log($scope.listaRiesgos[i]);
		}*/
	};

	$scope.volver = function(){
		$scope.probabilidadesNulas = false;
		$scope.listaRiesgos.forEach(function (item){
			if(item.probabilidad == undefined){
				$scope.probabilidadesNulas=true;
			}
		});
		if($scope.probabilidadesNulas){
			$scope.mensajeWarning ="Existe un riesgo sin probabilidad en el proyecto.";
		}
		else{
			$uibModalInstance.dismiss('cancel');
		}
	};

	$scope.addRiesgo = function(){
		var modalInstance = $uibModal.open({
	      templateUrl: 'modalAddRiesgo.html',
	      controller: 'modalAddRiesgoController',
	      scope: $scope,
	      size: 'md'
	    });
	}

});

app.controller("modalAddRiesgoController", function($scope, $uibModalInstance, $http, $window){
	//Cargamos los predefinidos
	$http.get('/categoriaRiesgos').success(function(data) {
		$scope.categoriaRiesgos = [];

		data.forEach(function (item) {
			$scope.categoriaRiesgos.push(String(item.nombre));
		});
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});

	$http.get('/impactoRiesgo').success(function(data) {
		$scope.impactoRiesgos = [];

		data.forEach(function (item) {
			$scope.impactoRiesgos.push(String(item.nombre));
		});
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});
	// Función para registrar a un riesgo
	$scope.registrarRiesgo = function() {
		$scope.mensajeWarning = false;
		$scope.mensajeSuccess = false;
		$scope.mensaje = "";

		$http.post('/riesgo', $scope.nuevoRiesgo)
		.success(function(data) {
			$scope.nuevoRiesgo = {}; // Borramos los datos del formulario
			$scope.mensajeWarning = false;
			$scope.mensajeSuccess =  true;
			$scope.mensaje = "Riesgo creado con exito";

			//Añadimos el nuevo riesgo a la lista :)
			$scope.listaRiesgosParaAnadir.push(data);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

	$scope.volver = function(){
		$uibModalInstance.dismiss('cancel');
	}
});
app.controller("modalEstablecerLineaCorteController", function($scope, $uibModalInstance, $http, $window){
	$scope.listaRiesgosLineaCorte = [];
	for (var i=0; i<$scope.listaRiesgos.length; i++) {
		$scope.listaRiesgosLineaCorte.push({
			nombre: $scope.listaRiesgos[i].nombre, 
			probabilidad: $scope.listaRiesgos[i].probabilidad, 
			impactoRiesgo: $scope.listaRiesgos[i].impactoRiesgo
		});
	};
	$scope.listaRiesgosLineaCorte.push({
		nombre: "LINEA DE CORTE", 
		probabilidad: 0, 
		impactoRiesgo: ""
	});
	//ORDENAMOS EL MODELO DE MAYOR A MENOR
	$scope.listaRiesgosLineaCorte.sort(function(a, b) {
    	return parseInt(b.probabilidad) - parseInt(a.probabilidad);
	});
	$scope.riesgoPorDebajoCorte = $scope.listaRiesgosLineaCorte.length-1;

	$scope.porcentaje = function(valor){
		if(valor != "")
			return valor+"%";
	};
	$scope.indice = function (index, riesgo){
		if(riesgo.nombre == "LINEA DE CORTE")
			return "";
		else
			return index+1;
	};
	$scope.volver = function(){
		//console.log(JSON.stringify($scope.listaRiesgosLineaCorte));
		//console.log("numero de elementos: "+$scope.listaRiesgosLineaCorte.length);
		//console.log("posicion lineaCorte: "+$scope.riesgoPorDebajoCorte);
		//$scope.listaRiesgos.splice($scope.riesgoPorDebajoCorte, 0, $scope.listaRiesgosLineaCorte[$scope,riesgoPorDebajoCorte]);
		$uibModalInstance.dismiss('cancel');
	};
	 
    var move = function (origin, destination) {
	    var temp = $scope.listaRiesgosLineaCorte[destination];
	    $scope.listaRiesgosLineaCorte[destination] = $scope.listaRiesgosLineaCorte[origin];
	    $scope.listaRiesgosLineaCorte[origin] = temp;
	};

	$scope.subir = function(index){			
		move(index, index - 1);
		$scope.riesgoPorDebajoCorte = index-1;
	};

	$scope.bajar = function(index){					
		move(index, index + 1);
		$scope.riesgoPorDebajoCorte = index+1;
	};
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////Controladores para modificar y eliminar proyecto///////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.controller("modalBorrarController", function($scope, $uibModalInstance, $http, $window){
	$scope.borrar = function () {
		$http.delete('/proyecto/' + $scope.proyectoABorrar._id)
		.success(function(data) {		
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
		/*if($scope.administrador)
			$window.location.href = '/gestionProyectos.html'
		if($scope.registrado)
			$window.location.href = '/proyectos.html'*/
		$uibModalInstance.dismiss('cancel');
		javascript:location.reload();
	};

	$scope.cancelar = function () {
		$uibModalInstance.dismiss('cancel');
	};
});

app.controller("modalModificarController", function($scope, $uibModalInstance, $http, $window){
	$scope.modificar = function () {
		$scope.mensajeWarning = false;
		$scope.mensaje = "";

		$scope.nuevoProyectoASubir = {};
		$scope.nuevoProyectoASubir._id = $scope.proyectoAModificar._id;
    	$scope.nuevoProyectoASubir.nombre = $scope.proyectoAModificar.nombre;
		$scope.nuevoProyectoASubir.tipoProyecto = $scope.proyectoAModificar.tipoProyecto;
		$scope.nuevoProyectoASubir.descripcion = $scope.proyectoAModificar.descripcion;
		$scope.nuevoProyectoASubir.fechaInicio = new Date($scope.proyectoAModificar.fechaInicio);
		$scope.nuevoProyectoASubir.fechaFin = new Date($scope.proyectoAModificar.fechaFin);
		
		$scope.nuevoProyectoASubir.listaRiesgos = [];

		for (var i=0; i<$scope.listaRiesgos.length;i++) {
    		$scope.nuevoProyectoASubir.listaRiesgos.push({
    			idRiesgo: $scope.listaRiesgos[i].idRiesgo,
    			probabilidad: $scope.listaRiesgos[i].probabilidad
    		});
    	};

    	$scope.nuevoProyectoASubir.listaUsuarios = [];
    	for (var i=0; i<$scope.listaTodosUsuarios.length;i++) {
    		if($scope.listaTodosUsuarios[i].seleccionado)
    			$scope.nuevoProyectoASubir.listaUsuarios.push({
    				idUsuario: $scope.listaTodosUsuarios[i]._id
    			});
    	};
    	
    	//console.log(JSON.stringify($scope.nuevoProyectoASubir));
    	
    	if($scope.comprobarFecha($scope.nuevoProyectoASubir.fechaInicio,$scope.nuevoProyectoASubir.fechaFin)){
			$http.put('/proyecto/' + $scope.nuevoProyectoASubir._id, $scope.nuevoProyectoASubir)
			.success(function(data) {
				$scope.mensajeWarning = false;
				$scope.mensajeSuccess =  true;
				$scope.mensaje = "Proyecto modificado correctamente";
			})
			.error(function(data) {
			console.log('Error: ' + data);
			});
			
    	}
    	else{
    		$scope.mensajeSuccess =  false;
    		$scope.mensajeWarning = true;
    		$scope.mensaje = "La fecha de inicio debe ser menor a la fecha de fin";
    	}
	};

	$scope.cancelar = function () {
		/*if($scope.administrador)
			$window.location.href = '/gestionProyectos.html'
		if($scope.registrado)
			$window.location.href = '/proyectos.html'*/
		$uibModalInstance.dismiss('cancel');
	};
});