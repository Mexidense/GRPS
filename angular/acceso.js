var app = angular.module("Acceso", ["ui.bootstrap", "ngRoute", "ngCookies"]);

app.controller("AccesoController", function($scope, $http, $window, $uibModal, $cookieStore){

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
		//console.log(usuario);
	}

	

	$scope.cerrarSesion = function(){
		$cookieStore.remove("usuarioRegistrado");
		$window.location.href = '/index.html';
	}
});