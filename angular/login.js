var app = angular.module("Login", ["ui.bootstrap", "ngRoute", "ngCookies"]);

app.controller("LoginController", function($scope, $http, $window, $uibModal, $cookieStore){

	$scope.mensaje ="";
	$scope.mensajeWarning = false;
	$scope.encontrado = false;
	$scope.autentificado = false;
	$scope.hacerLogin = function(){
		//Cargamos la lista de usuarios:
		$scope.listaUsuarios = [];
		//Cargamos todos los usuarios...
		$http.get('/usuarios').success(function(data) {
			$scope.listaUsuarios = data;
			//console.log($scope.usuario.pass.length);
			if($scope.usuario.pass.length<=8){
				$scope.mensaje = "Recuerda que la contraseña debe tener más de 8 caracteres";
				$scope.mensajeWarning = true;
			}
			else{
				$scope.mensaje ="";
				$scope.mensajeWarning = false;
				$scope.encontrado = false;
				$scope.autentificado = false;

				for(var i=0; i<$scope.listaUsuarios.length;i++){
				if($scope.listaUsuarios[i].email == $scope.usuario.email){
					$scope.encontrado = true;
					if($scope.listaUsuarios[i].pass == $scope.usuario.pass){
						$scope.autentificado = true;
						$cookieStore.put("usuarioRegistrado", $scope.listaUsuarios[i]);
						alert("Bienvenido " +$cookieStore.get("usuarioRegistrado").nombre);
					}
				}
				}
				if($scope.encontrado && !$scope.autentificado){
						$scope.mensaje = "Comprueba tu contraseña";
						$scope.mensajeWarning = true;
				}
				if(!$scope.encontrado){
					$scope.mensaje = "No estás registrado con este email";
					$scope.mensajeWarning = true;
				}

				if($scope.autentificado){
					console.log("autentificado");

					$window.location.href = '/index.html';
				}
			}

		})
		.error(function(data) {
			console.log('Error: ' + data);
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