const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let metricaSchema  = new Schema({

    Empresa:{
        type: String,
        required: [true, 'Nombre de empresa es necesario']
    },
    Zona:{
        type: String,
        required: [true, 'Zona es necesario']
    },
    Metrica:{
        type: String,
        required: [true, 'Metrica es necesario'],
        
    }
});

module.exports = mongoose.model('Metricas', metricaSchema);