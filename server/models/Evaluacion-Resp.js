const mongoose = require('mongoose');


let Schema = mongoose.Schema;

let evaluacionSchema  = new Schema({
    Empresa:{
        type: String,
        required: [true]
    },
    Area:{
        type: String,
        required: [true]
    },
    IndexE:{
        type: Number,
        required: [true]
    },
    Trabajador:{
        type: String,
        required: [true]
    },
    Funcion:{
        type: String,
        required: [true]
    },
    Indicador:{
        type: String,
        required: [true]
    },
    Calificacion:{
        type: Number,
        required: [true]
    },
    Mes:{
        type: String,
        required: [true]
    },
    FechaC:{
        type: String,
        required: [true]
    }
});

module.exports = mongoose.model('EvaRespuestas', evaluacionSchema);