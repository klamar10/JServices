const express = require('express');
const _ = require('underscore');
const moment = require('moment-timezone');
const dateLima = moment.tz(Date.now(), "America/Lima").format('DD-MM-YYYY HH:mm');
const control = moment.tz(Date.now(), "America/Lima").format('DD-MM-YYYY');
var GPS = require('gps');
var gps = new GPS;
// constantes
const app = express();

// Recursos
const Asignacion =  require ('../models/asignacion'); 
const Respuesta = require('../models/asig_rspt');
const { verificaToken, verificaRol } = require('../middlewares/autenticacion');
app.post('/AsigRpta', [verificaToken ],function (req, res) {
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
        FechaR: now,
        FechaC: ctr
    });
    let met =req.body.Metrica
    Respuesta.findOne({Nombre: body.Nombre, FechaC: ctr, Metrica: met}, (err, respuestaDB) => {
        if (!respuestaDB){
            respuesta.save((err, regis)=>{
                if(err){
                    return res.status(400).json(err);
                }
                res.json({
                    ok: true,
                    metrica: regis
                });
            })
        }else {
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Ya se encuentra gestionado'
            }
        });}
        });

});
app.get('/AsigRptas',[verificaToken ], (req, res) => {
    let FechaC = req.body.FechaC;
    let Metricac = req.body.Metrica;
    let Nombre = req.body.Nombre;
    Respuesta.find({ Metrica: Metricac, FechaC: FechaC, Nombre: Nombre })
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
app.get('/AsigRpta', [verificaToken ],(req, res) => {

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
app.get('/AsigRptas/:Empresa', (req, res) => {
    let Usuario = req.params.Empresa;
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