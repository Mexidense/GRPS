var mongoose = require( 'mongoose' );
	Schema   = mongoose.Schema;

var categoriaRiesgos = new Schema({
	nombre: { type: String }
});
//La coleccion se llamara Usuarios
module.exports = mongoose.model('CategoriasRiesgo', categoriaRiesgos);
