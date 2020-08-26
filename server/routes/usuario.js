const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require ('underscore');

// constantes
const app = express();


// Recursos
const Usuario =  require ('../models/usuario'); 
const { verificaToken, verificaRol } = require('../middlewares/autenticacion');

app.get('/usuario',[verificaToken, verificaRol ],(req, res) => {

    Usuario.find()
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json(err);
            }
           res.json(usuarios)
        });
});
app.get('/usuario/:id',[verificaToken, verificaRol ],(req, res) => {
    let id = req.params.id
    Usuario.findOne({_id: id},(err, usuarios)=> {
            if (err) {
                return res.status(400).json(err);
            }
           res.json(usuarios)
        });
});
app.get('/usuariox' ,(req, res)=> {
    
    let desde = req.query.desde || 0;
    desde= Number(desde);
    
    let limite = req.query.limite || 5;
    limite= Number(limite);

    Usuario.find({estado : 'Activo'}, 'id nombre email estado roles empresa') //google: true // campos a mostrar
        .skip(desde)
        .limit(limite)
        .exec( (err, usuarios ) =>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.countDocuments({estado : 'Activo'}, (err, conteo)=>{
            res.json({
                ok: true,
                usuarios,
                cantidad: conteo
            });
            });
        })

});

app.get('/usuario/:empresa' ,[verificaToken, verificaRol ],(req, res)=> {
    let empresa = req.params.empresa;
    Usuario.find({empresa : empresa, estado : 'Activo' })
        .exec((err, empresa) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
           res.json(empresa)
        });
});

app.post('/usuario',[verificaToken, verificaRol ],function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        DNI: body.DNI,
        email: body.email,
        password: body.password,// bcrypt.hashSync(body.password, 10), 
        roles: body.roles,
        estado: body.estado,
        empresa: body.empresa
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
app.put('/usuario/:id',function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','DNI', 'email', 'password','roles','estado','empresa'])  ;
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

app.delete('/usuario/:id',[verificaToken, verificaRol ], function(req, res) {
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

