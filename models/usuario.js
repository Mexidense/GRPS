var mongoose = require( 'mongoose' );
	Schema   = mongoose.Schema;

var usuario = new Schema({
	nombre: { type: String },
    email: 	{ type: String },
    pass: 	{ type: String },
    tipo: {type: String	}
});
//La coleccion se llamara Usuarios
module.exports = mongoose.model('Usuarios', usuario);
