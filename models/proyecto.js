var mongoose = require( 'mongoose' );
	Schema   = mongoose.Schema;

var proyecto = new Schema({
	nombre: { type: String },
	tipoProyecto: { type: String },
	descripcion: { type: String },
	fechaInicio: { type: Date },
	fechaFin: { type: Date },
	riesgoPorDebajoCorte: { type: String },
	listaRiesgos:[{
		idRiesgo:{ type: String }, 
		probabilidad:{ type: Number }
	}],
	listaUsuarios:[{
		idUsuario: { type: String }
	}]
});

module.exports = mongoose.model('Proyecto', proyecto);
