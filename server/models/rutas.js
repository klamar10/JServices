const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let estados = {
    values: ['Activo', 'Activo'],
    message: '{value} No es un estado valido'
};
const Schema = mongoose.Schema;
var schema = new Schema({
    Ruta:{
        type: String,
        required: [true, 'La Ruta es necesario'],
        unique: true 
    },
    Estado:{
        type: String,
        required: [true, 'El Estado es necesario']
    } 
});
schema.plugin( uniqueValidator, { message: '{PATH} debe de ser único'});
module.exports=mongoose.model('Rutas', schema);