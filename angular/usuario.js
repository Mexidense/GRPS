var app = angular.module("GestionUsuarios", ["ui.bootstrap", "ngRoute","ngCookies"]);

app.controller("userController", function($scope, $http, $window, $uibModal,$cookieStore){
 	
	$scope.usuarios={};

	//Mostrar todos los usuarios
	$http.get('/usuarios').success(function(data) {
		$scope.usuarios = data;
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});


	//Función para redireccionar a registro usuario
	$scope.irRegistrarUsuario = function(){
		 $window.location.href = '/crearUsuario.html';
	};
	$scope.nuevoUsuario = {};
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
	

	// Función para registrar a un usuario
	$scope.registrarPersona = function() {
		$scope.mensajeWarning = false;
		$scope.mensajeSuccess = false;
		$scope.mensaje = "";
		$http.get('/usuarios').success(function(data) {
			$scope.comprobacionEmail = data;
			$scope.existeEmail = false;
			for(var i=0; i<$scope.comprobacionEmail.length; i++){
				if($scope.comprobacionEmail[i].email == $scope.nuevoUsuario.email){
					$scope.existeEmail = true;
					break;
				}
			}
			if(!$scope.existeEmail){
				if($scope.nuevoUsuario.pass.length > 8){
					if($scope.nuevoUsuario.pass == $scope.nuevoUsuario.pass2){
						if($scope.invitado)
							$scope.nuevoUsuario.tipo = "Estandar";
						$http.post('/usuarios', $scope.nuevoUsuario)
						.success(function(data) {
							$scope.nuevoUsuario = {}; // Borramos los datos del formulario
							$scope.mensajeWarning = false;
							$scope.mensajeSuccess =  true;
							$scope.mensaje = "Usuario creado con exito";
							//$window.location.href = '/views/gestionUsuarios.html';
						})
						.error(function(data) {
							console.log('Error: ' + data);
						});
					}
					else{
						$scope.mensajeWarning = true;
						$scope.mensaje="Las contraseñas no coinciden";
					}
				}
				else{
					$scope.mensajeWarning = true;
					$scope.mensaje="Introduzca una contraseña de más de 8 caracteres";
				}
			}
			else{
				$scope.mensajeWarning = true;
				$scope.mensaje="Email no valido: Este email ya está registrado en el sistema";
			}
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});		
	};

	$scope.volverGestion = function(){
		 $window.location.href = '/gestionUsuarios.html';
	};

	
	$scope.irModalBorrado = function(usuario){
		$scope.usuarioABorrar = usuario;
		var modalInstance = $uibModal.open({
	      templateUrl: 'modalBorrar.html',
	      controller: 'modalBorrarController',
	      scope: $scope
	    });
	};

	$scope.irModalModificar = function(usuario){
		$scope.usuarioAModificar = usuario;
		var modalInstance = $uibModal.open({
	      templateUrl: 'modalModificar.html',
	      controller: 'modalModificarController',
	      scope: $scope
	    });
	}
	
});
app.controller("modalBorrarController", function($scope, $uibModalInstance, $http, $window){
	$scope.borrar = function () {
		$http.delete('/usuarios/' + $scope.usuarioABorrar._id)
		.success(function(data) {		
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
		$uibModalInstance.dismiss('cancel');
		$window.location.href = '/gestionUsuarios.html';
	};

	$scope.cancelar = function () {
		$uibModalInstance.dismiss('cancel');
	};
});

app.controller("modalModificarController", function($scope, $uibModalInstance, $http, $window){
	$scope.modificar = function () {
		$scope.mensajeWarning = false;
		$scope.mensaje = "";

		if($scope.usuarioAModificar.pass.length >= 8){
			$http.put('/usuarios/' + $scope.usuarioAModificar._id, $scope.usuarioAModificar)
			.success(function(data) {		
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
			$uibModalInstance.dismiss('cancel');
			$window.location.href = '/gestionUsuarios.html';
		}
		else{
			$scope.mensajeWarning = true;
			$scope.mensaje="Introduzca una contraseña de más de 8 caracteres";
		}
	};

	$scope.cancelar = function () {
		$uibModalInstance.dismiss('cancel');
		$window.location.href = '/gestionUsuarios.html';
	};
});



