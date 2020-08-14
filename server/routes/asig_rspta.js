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
const Respuesta = require('../models/asig_rspt');
app.post('/AsigRpta', function (req, res) {
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
    Respuesta.findOne({}, (err, respuestaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!respuestaDB) {
            respuesta.save((err, asigBD) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                //usuarioDB.password = null;
                res.json({
                    ok: true,
                    respuesta: asigBD
                });
            });
        }
        else {
            if ((respuestaDB.Metrica == body.Metrica)) {
                if ((respuestaDB.Nombre == body.Nombre)) {
                    if ((respuestaDB.FechaC == control)) {
                         res.status(500)
                    } else {
                        respuesta.save((registrar) => {
                            res.json(registrar);
                        })
                    }
                }
                respuesta.save((registrar) => {
                     res.json(registrar);
                 })
            }
            respuesta.save((registrar) => {
                 res.json(registrar);
             })
        }


    })
});
app.get('/AsigRptas', (req, res) => {
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
app.get('/AsigRptas/:Empresa', (req, res) => {
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
app.get('/AsigRptaC/:Empresa', (req, res) => {
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
app.get('/x', (req, res) => {

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