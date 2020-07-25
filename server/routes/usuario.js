const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require ('underscore');
// constantes
const app = express();


// Recursos
const Usuario =  require ('../models/usuario'); 

app.get('/usuario', function(req, res) {
    
    let desde = req.query.desde || 0;
    desde= Number(desde);
    
    let limite = req.query.limite || 5;
    limite= Number(limite);

    Usuario.find({estado : 'A'}, 'id nombre email estado') //google: true // campos a mostrar
        .skip(desde)
        .limit(limite)
        .exec( (err, usuarios ) =>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({estado : 'A'}, (err, conteo)=>{
            res.json({
                ok: true,
                usuarios,
                cantidad: conteo
            });
            });
        })

});

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), 
        roles: body.roles,
        estado: body.estado
    });

    usuario.save( (err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


});
app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre78','email', 'img', 'role','estado'])  ;

    Usuario.findByIdAndUpdate( id, body, { new: true, runValidators: true } ,(err, usuarioDB) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
    
});

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let cambiaEstado ={
        estado: 'I'
    }
    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
        Usuario.findByIdAndUpdate(id,cambiaEstado,{new: true} ,(err,  usuarioBorrado)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!usuarioBorrado){
            return res.status(400).json({
                ok:false,
                error:{
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })

});
module.exports = app;

