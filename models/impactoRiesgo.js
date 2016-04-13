var mongoose = require( 'mongoose' );
	Schema   = mongoose.Schema;

var impactoRiesgo = new Schema({
	nombre: { type: String }
});
//La coleccion se llamara Usuarios
module.exports = mongoose.model('ImpactosRiesgo', impactoRiesgo);
