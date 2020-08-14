const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let empresaSchema  = new Schema({
    Ruc:{
        type: Number,
        unique: true,
        required: [true, 'El ruc es necesario']
    },
    Nombre:{
        type: String,
        unique: true,
        required: [true, 'Nombre de empresa es necesario']
    },
    Departamento:{
        type: String,
        required: [true, 'Departamento es necesario']
    },
    Estado:{
        type: String,
        required: [true, 'Estado es necesario']
    }
});
empresaSchema.plugin(uniqueValidator, {message: 'Ya existe la empresa'});
module.exports = mongoose.model('Empresas', empresaSchema);