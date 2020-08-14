const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let indicadorSchema  = new Schema({

    Empresa:{
        type: String,
        required: [true, 'Empresa es necesario']
    },
    Zona:{
        type: String,
        required: [true, 'Zona es necesario']
    },
    Metrica:{
        type: String,
        required: [true, 'Metrica es necesario']
    },
    Indicador:{
        type: String,
        required: [true, 'Indicador es necesario']
    }
});
indicadorSchema.plugin(uniqueValidator, {message: 'Ya existe la empresa'});
module.exports = mongoose.model('Indicadores', indicadorSchema);