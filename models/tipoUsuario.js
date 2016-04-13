var mongoose = require( 'mongoose' );
	Schema   = mongoose.Schema;

var tipoUsuario = new Schema({
	nombre: { type: String }
	});
//La coleccion se llamara Usuarios
module.exports = mongoose.model('TiposUsuario', tipoUsuario);
