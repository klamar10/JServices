const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let zonaSchema  = new Schema({

    Zona:{
        type: String,
        required: [true, 'Zona es necesario']
    },
    Estado:{
        type: String,
        default: 'Activo'
    },
    Empresa:{
        type: String,//  Schema.Types.ObjectId, ref: "empresas",
        required: [true, 'Nombre de empresa es necesario']
    }
});
zonaSchema.plugin(uniqueValidator, {message: 'Ya existe la empresa'});
module.exports = mongoose.model('Zonas', zonaSchema);