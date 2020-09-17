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
const Indicador =  require ('../models/indicador'); 
const { verificaToken, verificaRol } = require('../middlewares/autenticacion');

app.post('/Asignacion',[verificaToken, verificaRol ],function(req,res){
    let now = dateLima
    let body = req.body;
    let asignacion = new Asignacion({
        Empresa: body.Empresa,
        Zona: body.Zona,
        Nombre: body.Nombre,
        Metrica: body.Metrica,
        Indicador: body.Indicador,
        Fecha: now
    });
Asignacion.findOne({Empresa:body.Empresa, Zona: body.Zona,Metrica: body.Metrica,Nombre: body.Nombre},(err,asig)=>{
        if(!asig){
            asignacion.save( (err,asigDB)=>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                //usuarioDB.password = null;
                res.json({
                    ok: true,
                    asignacion: asigDB
                });
            });
        }else {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Ya se encuentra asignado'
                }
            });}
    })

});
app.get('/Asignaciones',[verificaToken],(req, res) => {
    let now = dateLima //Obtienes la fecha
//var dat2 = Date.parse(dat); //Lo parseas para transformarlo
    Asignacion.find()
        .exec((err, asignacion) => {
            if (err) {
                return res.status(400).json(err);
            }
           res.json(asignacion)

          // console.log(dateLima)
        });
});
app.get('/Asignaciones/:Nombre',[verificaToken],(req,res)=>{
    let Nombre = req.params.Nombre;
    let fecha = control
    Asignacion.find({Nombre : Nombre, Fecha:{$ne: fecha}})
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
/*
app.get('/AsignacioneT/:Nombre',(req,res)=>{
    let Nombre = req.params.Nombre;
    Asignacion.find({Nombre : {$ne: Nombre}})
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
app.get('/Asignacionex/:Nombre',(req,res)=>{
    let Nombre = req.params.Nombre;
   Respuesta.find({Nombre : Nombre, FechaC: '07/09/2020'})
        .exec((err,   metrica  ) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Respuesta.countDocuments({Nombre : Nombre, FechaC: '07/09/2020'}, (err, conteo) => {

                res.json({
                    ok: true,
                    metrica,
                    cantidad: conteo
                });
            });
        });

});
*/
app.get('/Asignacion/:id',[verificaToken ],(req,res)=>{
    let Id = req.params.id;
    Asignacion.findOne({_id : Id})
        .exec((err,  asignacion   ) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }let asig = (asignacion )
                res.json(asig)
        });
});
app.delete('/Asignacion/:id', [verificaToken, verificaRol ],function(req, res) {
    let id = req.params.id;
 
    Asignacion.findByIdAndDelete(id, (err, indicadorBorrado)=>{
      //  Empresa.findByIdAndUpdate(id,cambiaEstado,{new: true} ,(err,  estadoBorrado)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!indicadorBorrado){
            return res.status(400).json({
                ok:false,
                error:{
                    message: 'Asignacion no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            zona: indicadorBorrado
        })
    })

});
module.exports = app;