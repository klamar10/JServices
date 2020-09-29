const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let schema = mongoose.schema;

let Schema  = mongoose.Schema;
let funcionSchema = mongoose.Schema({
    
    Estado:{
        type: String,
        required: [true, 'El Estado es necesario']
    },
    Ruta:{
        type: String,
        required: [true, 'La ruta es necesario']
    },
    Trabajador:{
        type: String,
        required: [true, 'El trabajador es necesario']
    }  
})
funcionSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser único'});
module.exports=mongoose.model('AsigRuta', funcionSchema);