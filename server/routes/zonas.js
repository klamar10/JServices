const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require ('underscore');

// constantes
const app = express();


// Recursos
const Zona =  require ('../models/zona'); 
const Empresas =  require ('../models/empresa'); 
const { verificaToken, verificaRol } = require('../middlewares/autenticacion');

app.get('/Zonas' ,[verificaToken, verificaRol ],(req, res)=> {
    Zona.find()
        .exec((err, zonas) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
           res.json(zonas)
        });

});
app.get("/Zonass" ,[verificaToken, verificaRol ],(req, res)=> {
    Zona.find().
    populate('empresas').
    exec(function (err, pacientes) {
      if (err) return handleError(err);
      console.log(pacientes);
    });
});
app.get('/Zona/:empresa' ,[verificaToken, verificaRol ],(req, res)=> {
    let empresa = req.params.empresa;
    Zona.find({Empresa : empresa})
        .exec((err, zonas) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
           res.json(zonas)
        });

});

app.post('/Zona',[verificaToken, verificaRol ],function(req, res) {

    let body = req.body;

    let zona = new Zona({
        Zona: body.Zona,
        Empresa: body.Empresa,
        Estado: body.Estado
    });
Zona.findOne({Empresa:body.Empresa, Zona: body.Zona},(err,zonar)=>{
    if(!zonar){
        zona.save( (err,zonaDB)=>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            //usuarioDB.password = null;
            res.json({
                ok: true,
                Zona: zonaDB
            });
        });
    }else {
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Ya se encuentra registrado'
            }
        });}
})
});
app.put('/Zona/:id', [verificaToken, verificaRol ],function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['Empresa','Zona','estado']);

    Zona.findByIdAndUpdate( id, body, { new: true, runValidators: true } ,(err, usuarioDB) =>{
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

app.delete('/Zona/:id', [verificaToken, verificaRol ],function(req, res) {
    let id = req.params.id;
    let cambiaEstado ={
        estado: 'I'
    }
    Zona.findByIdAndDelete(id, (err, zonaBorrada)=>{
    //    Usuario.findByIdAndUpdate(id,cambiaEstado,{new: true} ,(err,  usuarioBorrado)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!zonaBorrada){
            return res.status(400).json({
                ok:false,
                error:{
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            zona: zonaBorrada
        })
    })

});
module.exports = app;

