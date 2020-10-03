const mongoose = require('mongoose');


let Schema = mongoose.Schema;

let evaluacionSchema  = new Schema({
    Index:{
        type: Number,
        required: [true]
    },
    Evaluacion:{
        type: String,
        required: [true]
    }
});

module.exports = mongoose.model('Evaluaciones', evaluacionSchema);