const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema  = mongoose.Schema;
let tiposValidos = {
    values: ['CI', 'AI'],
    message: '{value} no es un tipo valido'
};

let asignacionSchema = new Schema({
    Empresa:{
        type: String,
        required:[true, 'Empresa es necesario']
    },
    Zona:{
        type: String,
        required:[true, 'Zona es necesario']
    },
    Metrica:{
        type: String,
        required: [true, 'Metrica es necesario']
    },
    Indicador:{
        type: String,
        required: [true, 'Indicador es necesario']
    },
    Fecha:{
        type: String,
        required: [true, 'Fecha es necesario']
    },
    Ruta:{
        type: String,
        required: [true, 'Ruta es necesario']
    }
})
asignacionSchema.virtual('fecha_asignacion')
  .set(function(fecha) {
    // El formato esperado es 'yyyy-mm-dd' que es el devuelto por el campo input
    // el valor recibido se almacenará en el campo fecha_nacimiento_iso de nuestro documento
    this.Fecha = new Date(fecha);
  })
  .get(function(){
    // el valor devuelto será un string en formato 'yyyy-mm-dd'
    return this.Fecha.toISOString().substring(0,10);
  });

module.exports = mongoose.model('Asignaciones', asignacionSchema);