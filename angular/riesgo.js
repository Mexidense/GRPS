var app = angular.module("GestionRiesgos", ["ui.bootstrap", "ngRoute", "ngCookies"]);

app.controller("GestionRiesgosController", function($scope, $http, $window, $uibModal, $cookieStore){
 	
 	//Mostrar todos los riesgos
	$http.get('/riesgo').success(function(data) {
		$scope.riesgos = data;
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});
	
	//Función para redireccionar a registro usuario
	$scope.irRegistrarRiesgo = function(){
		 $window.location.href = '/crearRiesgo.html';
	};
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	$scope.nuevoRiesgo = {};

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

	$scope.volver = function(){
		 $window.location.href = '/gestionRiesgos.html';
	};

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
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////modales para editar y modificar
	/////////////////////////////////////////////////////////////////////////////
	$scope.irModalModificar = function(riesgo){
		$scope.riesgoAModificar = riesgo;
		var modalInstance = $uibModal.open({
	      templateUrl: 'modalModificar.html',
	      controller: 'modalModificarController',
	      scope: $scope
	    });
	}
	$scope.irModalBorrado = function(riesgo){
		$scope.riesgoABorrar = riesgo;
		var modalInstance = $uibModal.open({
	      templateUrl: 'modalBorrar.html',
	      controller: 'modalBorrarController',
	      scope: $scope
	    });
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////Controladores para los modales de editar y modificar
/////////////////////////////////////////////////////////////////////////////
app.controller("modalModificarController", function($scope, $uibModalInstance, $http, $window){
	$scope.modificar = function () {
		$scope.mensajeWarning = false;
		$scope.mensaje = "";

		$http.put('/riesgo/' + $scope.riesgoAModificar._id, $scope.riesgoAModificar)
		.success(function(data) {		
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
		$window.location.href = '/gestionRiesgos.html';
		
	};

	$scope.cancelar = function () {
		$uibModalInstance.dismiss('cancel');
	};
});
app.controller("modalBorrarController", function($scope, $uibModalInstance, $http, $window){
	$scope.borrar = function () {
		$http.delete('/riesgo/' + $scope.riesgoABorrar._id)
		.success(function(data) {		
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
		$window.location.href = '/gestionRiesgos.html';
	};

	$scope.cancelar = function () {
		$uibModalInstance.dismiss('cancel');
	};
});



