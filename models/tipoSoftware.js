var mongoose = require( 'mongoose' );
	Schema   = mongoose.Schema;

var tipoSoftware = new Schema({
	nombre: { type: String }
	});
//La coleccion se llamara Usuarios
module.exports = mongoose.model('TiposSoftware', tipoSoftware);
