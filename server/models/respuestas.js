const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema  = mongoose.Schema;
let tiposValidos = {
    values: ['CI', 'AI'],
    message: '{{value}} no es un tipo valido'
};

let asig_rsptsSchema = new Schema({
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
        required: [true]
    },
    Ruta:{
        type: String,
        required: [true, 'La Ruta es necesario']
    },
    Condicion:{
        type: String,
        required: [true]
    },
    Tipo:{
        type: String,
        enum: tiposValidos,
        required: [true]
    },
    Comentarios:{
        type: String,
        required: [true]
    },
    Trabajador:{
        type: String,
        required: [true]
    },
    FechaR:{
        type: String,
        required: [true]
    },
    FechaC:{
        type: String,
        required: [true]
    },
    Asignaciones:{type: String,
        required: [true] }
})
asig_rsptsSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser único'});
module.exports = mongoose.model('Respuestas', asig_rsptsSchema);