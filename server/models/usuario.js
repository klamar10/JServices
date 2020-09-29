const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['Administrador', 'Usuario'],
    message: '{value} No es un rol valido'
};

let Schema  = mongoose.Schema;

const usuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'] 
    },
    DNI: {
        type: Number,
        required: [true, 'El DNI es necesario'] 
    },
    email: {
        type: String,
        required: [true, 'El usuario es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesario']
    },
    roles:{
        type: String,
       default: 'Administrador',
        enum: rolesValidos
    }, // default: USER_ROLE
    estado:{
        type: String,
        required: [true, 'El estado es necesario']
    },
    empresa: {
        type: String,
        equired: [true, 'La empresa es necesaria']
    },
    rutasAsig:[{ type: Schema.Types.ObjectId,
        ref:('AsigRuta')}],
    asigrpta:[{ type: Schema.Types.ObjectId,
        ref:('Respuestas')}]

});
/*usuarioSchema.methods.toJSON = function (){
    let user = this;
    let userObject = user.toObject();

    delete userObject.password;

    return userObject;
}*/

usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser único'});
module.exports = mongoose.model('Usuarios', usuarioSchema);