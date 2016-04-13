var mongoose = require( 'mongoose' );
	Schema   = mongoose.Schema;

var riesgo = new Schema({
	nombre: { type: String },
	categoriaRiesgo: { type: String },
	impactoRiesgo: { type: String },
	tipoRiesgo: { type: String },
	descripcion: { type: String },
	factores: { type: String },
	reduccion: { type: String },
	supervision:{ type: String }
	});
//La coleccion se llamara Usuarios
module.exports = mongoose.model('Riesgo', riesgo);
