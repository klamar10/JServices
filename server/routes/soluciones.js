const express = require('express');
const _ = require ('underscore');
const moment = require('moment-timezone');
let dateLima = moment.tz('America/Lima').format('DD/MM/YYYY HH:mm');
const control = moment.tz(Date.now(), "America/Lima").format('DD/MM/YYYY');
// constantes
const app = express();


// Recursos
const Asignacion =  require ('../models/asignacion'); 
const Respuesta = require('../models/asig_rspt');
const RespuestaN = require('../models/respuestas');
const AsigRuta = require('../models/AsigRuta');
const Rutas = require('../models/rutas');
app.get('/solucion/AsignacionesN/:Nombre',(req,res)=>{
    let Nombre = req.params.Nombre;
    let Fecha = control
    Asignacion.find({Nombre : Nombre,Fecha: {$ne: Fecha}})
        .exec((err,   metrica  ) => {
            if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
            }
            Asignacion.countDocuments({Nombre : Nombre, Fecha: {$ne: Fecha}}, (err, conteo)=>{
                res.json({
                    ok: true,
                    cantidad: conteo,
                    metrica
                    //89
                });
                });
        });
});
app.get('/solucion/Asignaciones/:Nombre',(req,res)=>{
    let Nombre = req.params.Nombre;
    let Fecha = control
    Asignacion.find({Nombre : Nombre,Fecha: Fecha})
        .exec((err,   metrica  ) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Asignacion.countDocuments({Nombre : Nombre, Fecha: Fecha}, (err, conteo)=>{
                res.json({
                    ok: true,
                    cantidad: conteo,
                    metrica
                    //89
                });
                });
        });
});
app.get('/solucion/AsignacionR/:Nombre',(req,res)=>{
    let Nombre = req.params.Nombre;
    let Fecha = control
    Respuesta.find({Nombre : Nombre, FechaC:Fecha})
        .exec((err,   metrica  ) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Respuesta.countDocuments({Nombre : Nombre, FechaC:Fecha}, (err, conteo)=>{
                res.json({
                    ok: true,
                    cantidad: conteo,
                    metrica
                    //89
                });
                });
        });
});
app.get('/solucion/Respuesta',(req,res)=>{
    let Zona = req.body.Zona;
    let Fecha = control
    Respuesta.find({Metrica: Zona})
        .exec((err,   metrica  ) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
           res.json(metrica)
        });
});
app.put('/solucion/nombreAsigU/:Nombre',function(req, res) {
    let Nombre = req.params.Nombre;
    //let body = _.pick(req.body, ['Nombre'])  ;
    let body = 'Neil Vasquez Pizango'
    Asignacion.updateMany( {Nombre: Nombre}, {Nombre:body},function(err, usuarioDB) {
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
// ELIMINACION DE CAMPO NOMBRE
app.get('/Eliminar',(req,res)=>{
    Asignacion.deleteMany({Empresa:{$exists:true}})
    .exec((err,resp)=>{
        if(err){

        }res.json(resp)
    })
})
app.get('/EliminarAsig',(req,res)=>{
    Rutas.deleteMany({trabajador:{$exists:true}})
    .exec((err,resp)=>{
        if(err){

        }res.json(resp)
    })
})
app.get('/EliminarRespuestaN',(req,res)=>{
    RespuestaN.deleteMany({Comentarios:{$exists:true}})
    .exec((err,resp)=>{
        if(err){

        }res.json(resp)
    })
})

module.exports = app;
