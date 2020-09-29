const express = require('express');
const _ = require('underscore');
const moment = require('moment-timezone');
let dateLima = moment.tz('America/Lima').format('DD/MM/YYYY HH:mm');
const control = moment.tz(Date.now(), "America/Lima").format('DD/MM/YYYY');
var GPS = require('gps');
var gps = new GPS;
const app = express();
// Recursos
const Asignacion =  require ('../models/asignacion'); 
const Respuesta = require('../models/asig_rspt');
const Usuario = require('../models/usuario');
const { verificaToken, verificaRol } = require('../middlewares/autenticacion');
/*app.post('/AsigRpta', [verificaToken ],function (req, res) {
    let now = dateLima;
    let ctr = control;
    let body = req.body;
    let respuesta = new Respuesta({
        Empresa: body.Empresa,
        Zona: body.Zona,
        Nombre: body.Nombre,
        Metrica: body.Metrica,
        Condicion: body.Condicion,
        Tipo: body.Tipo,
        Comentarios: body.Comentarios,
        Indicador: body.Indicador,
        FechaR: body.FechaR,
        FechaC: ctr
    });
    let met =req.body.Metrica
    let indicador =req.body.Indicador
    let nombre =req.body.Nombre
    let fecha = ctr
    let Zona= req.body.Zona
    Respuesta.findOne({Nombre: body.Nombre, FechaC: ctr, Metrica: met, Zona:Zona, Indicador: indicador}, (err, respuestaDB) => {
        if (!respuestaDB){
            respuesta.save((err, regis)=>{
                if(err){
                    return res.status(400).json(err);
                }
               /* Asignacion.findOneAndUpdate( {Metrica: met, Nombre: nombre, Indicador: indicador, Zona:Zona}, {Fecha: fecha}, { new: true, runValidators: true } ,(err, usuarioDB) =>{
                    if(err){
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }
                    res.json({
                        ok: true,
                        usuario: usuarioDB,
                    metrica: regis
                    });
                })
            })
            res.json(regis)
        }else {
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Ya se encuentra gestionado'
            }
        });}
        });

});*/
/*app.post('/AsigRpta', [verificaToken ],function (req, res) {
    let now = dateLima;
    let ctr = control;
    let body = req.body;
    let respuesta = new Respuesta({
        Empresa: body.Empresa,
        Zona: body.Zona,
        Nombre: body.Nombre,
        Ruta: body.Ruta,
        Metrica: body.Metrica,
        Condicion: body.Condicion,
        Tipo: body.Tipo,
        Comentarios: body.Comentarios,
        Indicador: body.Indicador,
        FechaR: body.FechaR,
        FechaC: ctr
    });
    Respuesta.findOne({Ruta: body.Ruta,Nombre: body.Nombre, FechaC: ctr, Metrica: body.Metrica, Zona:body.Zona, Indicador:body.Indicador}, (err, respuestaDB) => {
        if (!respuestaDB){
            respuesta.save((err, regis)=>{
                if(err){
                    return res.status(400).json(err);
                }
                res.json(regis)
            });
            }else{return res.status(400).json({
                ok: false,
                err:{
                    message: 'Ya se encuentra gestionado'
                }
            });}
    });
});*/

app.get('/AsigRptas', (req, res) => {
 
    Respuesta.find()
        .exec((err, asignacion) => {
            if (err) {
                return res.status(400).json(
                    {
                        ok: false,
                        err
                    });
            }
            res.json(asignacion)
        });
});
app.get('/AsigRpta',(req, res) => {

    Respuesta.find()
        .exec((err, asignacion) => {
            if (err) {
                return res.status(400).json(
                    {
                        ok: false,
                        err
                    });
            }
            res.json(asignacion)
        });
});

app.get('/AsigRptas/:Empresa',[verificaToken], (req, res) => {
    let Empresa = req.params.Empresa;
    Respuesta.find({ Empresa: Empresa })
        .exec((err, metrica) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json(metrica)
        });
});
app.get('/AsigRptaC/:Empresa',[verificaToken ], (req, res) => {
    let Empresa = req.params.Empresa;
    Respuesta.find({ Empresa: Empresa })
        .exec((err, metrica) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Respuesta.countDocuments({ FechaC: control }, (err, conteo) => {

                let data = [
                    { contar: conteo }
                ];
                res.json(data)
            });
        });
});
app.get('/AsigRptaT/:Empresa', [verificaToken ],(req, res) => {
    let Empresa = req.params.Empresa;
    Asignacion.find({ Empresa: Empresa })
        .exec((err, metrica) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Asignacion.countDocuments({ Empresa: Empresa}, (err, conteo) => {

                let data = [
                    { contar: conteo }
                ];
                res.json(data)
            });
        });
});
app.get('/x',[verificaToken ], (req, res) => {

    let body = req.body;
    Respuesta.find({}, (err, respuestaDB) => {


        if ((respuestaDB.Metrica == body.Metrica)) {
            if ((respuestaDB.Nombre == body.Nombre)) {
                if ((respuestaDB.FechaC == control)) {
                    return res.json('No permite gestionar')
                } else {
                    return res.json('fecha distinto')
                }
            }
            else { res.json('Usuario distinto') }
        }
        else { res.json('A gestionar') }
        console.log(control)

    })
});
module.exports = app;