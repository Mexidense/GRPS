var app = angular.module("GestionPredefinidos", ["ui.bootstrap", "ngRoute","ngCookies"]);

app.controller("GestionPredefinidosController", function($scope, $http, $window,$cookieStore){

	//Mostrar todos los tipos de software
	//////////////////////////////////////////////////////////////////////////////////////////////
	$http.get('/tipoSoftware').success(function(data) {
		$scope.tiposSoftware = [];

		data.forEach(function (item) {
			$scope.tiposSoftware.push(String(item.nombre));
		});
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});

	//Mostrar categoria de riesgos
	//////////////////////////////////////////////////////////////////////////////////////////////
	$http.get('/categoriaRiesgos').success(function(data) {
		$scope.categoriaRiesgos = [];

		data.forEach(function (item) {
			$scope.categoriaRiesgos.push(String(item.nombre));
		});
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});
	//Mostrar impactos de riesgos
	//////////////////////////////////////////////////////////////////////////////////////////////
	$http.get('/impactoRiesgo').success(function(data) {
		$scope.impactoRiesgo = [];

		data.forEach(function (item) {
			$scope.impactoRiesgo.push(String(item.nombre));
		});
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});
	//Mostrar tipos de usuario
	//////////////////////////////////////////////////////////////////////////////////////////////
	$http.get('/tipoUsuario').success(function(data) {
		$scope.tipoUsuario = [];

		data.forEach(function (item) {
			$scope.tipoUsuario.push(String(item.nombre));
		});
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});


	$scope.guardarTiposSoftware = function(data){
		$http.delete('/tipoSoftware')
		.success(function(data) {		
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

		$scope.tiposSoftware.forEach(function (item) {

			$scope.nuevoTipoSoftware = "{\"nombre\":\""+String(item)+"\"}";
			$http.post('/tipoSoftware', $scope.nuevoTipoSoftware)
			.success(function(data) {
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		});
		alert("Cambios guardados");
	};
	$scope.guardarCategoriasRiesgo = function(data){
		$http.delete('/categoriaRiesgos')
		.success(function(data) {		
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

		$scope.categoriaRiesgos.forEach(function (item) {

			$scope.nuevaCategoria = "{\"nombre\":\""+String(item)+"\"}";
			$http.post('/categoriaRiesgos', $scope.nuevaCategoria)
			.success(function(data) {
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		});
		alert("Cambios guardados");
	};
	$scope.guardarImpactosRiesgo = function(data){
		$http.delete('/impactoRiesgo')
		.success(function(data) {		
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

		$scope.impactoRiesgo.forEach(function (item) {

			$scope.nuevoImpacto = "{\"nombre\":\""+String(item)+"\"}";
			$http.post('/impactoRiesgo', $scope.nuevoImpacto)
			.success(function(data) {
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		});
		alert("Cambios guardados");
	};
	$scope.guardarTiposUsuario = function(data){
		$http.delete('/tipoUsuario')
		.success(function(data) {		
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

		$scope.tipoUsuario.forEach(function (item) {

			$scope.nuevoTipoUsuario = "{\"nombre\":\""+String(item)+"\"}";
			$http.post('/tipoUsuario', $scope.nuevoTipoUsuario)
			.success(function(data) {
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		});
		alert("Cambios guardados");
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
		console.log(usuario.tipo);
	}
});