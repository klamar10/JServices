const express = require('express');
const _ = require('underscore');
const moment = require('moment-timezone');
let dateLima = moment.tz('America/Lima').format('DD/MM/YYYY HH:mm');
const control = moment.tz(Date.now(), "America/Lima").format('DD/MM/YYYY');
// constantes
const app = express();


// Recursos
const Asignacion = require('../models/asignacion');
const Ruta = require('../models/rutas');
const RespuestaN = require('../models/respuestas');
const { verificaToken, verificaRol } = require('../middlewares/autenticacion');
const rutas = require('../models/rutas');

app.post('/Asignacion', [verificaToken, verificaRol], function (req, res) {
    let now = dateLima
    let fech = ''
    let body = req.body;
    let asignacion = new Asignacion({
        Empresa: body.Empresa,
        Zona: body.Zona,
        Metrica: body.Metrica,
        Indicador: body.Indicador,
        Fecha: 0,
        Ruta: body.Ruta
    });
    Asignacion.findOne({ Empresa: body.Empresa, Zona: body.Zona, Metrica: body.Metrica, Ruta: body.Ruta }, (err, asig) => {
        if (!asig) {
            asignacion.save((err, asigDB) => {
                if (err) {
                    return res.status(401).json({
                        ok: false,
                        err
                    });
                }
                //usuarioDB.password = null;
                res.json(asigDB).status(200)
            });
        } else {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Ya se encuentra asignado'
                }
            });
        }
    })

});
// CREAR ASIGNACION - RUTA // antes
app.post('/Asignacionx', (req, res) => {
    let now = dateLima
    let body = req.body;
    let asignacion = new Asignacion({
        Empresa: body.Empresa,
        Zona: body.Zona,
        Metrica: body.Metrica,
        Indicador: body.Indicador,
        Fecha: now,
        Ruta: body.ruta
    });
    asignacion.save((err, asigDB) => {
        if (err) {
            return res.status(401)
        }
        if (!asigDB) {
            return res.status(400)
        }
        res.json(asigDB)
    });
    //return res.json(asignacion)

}); 0

// TODAS LAS ASIGNACIONES
app.get('/Asignaciones', [verificaToken ], (req, res) => {
    Asignacion.find()
        .exec((err, asignacion) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    err
                });
            }
            res.json(asignacion)
        });
});

// LISTAR RUTAS POR ZONA
app.get('/Asignaciones/:Ruta', [verificaToken ],(req, res) => {
    let Ruta = req.params.Ruta
    Asignacion.find({ Ruta: Ruta, Fecha:{$ne : control} })
        .exec((err, ress) => {
            if (err) {
                res.status(401)
            }
            if (Ruta == '') {
                res.json('Ninguna ruta')
            }
            res.json(ress)
        })
})
// OBTENER ASIGNACIONES X ID
app.get('/AsignacionesID/:id', [verificaToken ], (req, res) => {
    let id = req.params.id
  
    Asignacion.findById({_id: id})
    .exec((err,resul)=>{
        if(err){
            res.status(401)
        }
        res.json(resul)
    })
});
//ELIMINAR
app.delete('/Asignacion/:id',[verificaToken, verificaRol ],  function (req, res) {
    let id = req.params.id;
    Asignacion.findByIdAndDelete(id, (err, ress) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err0

            });
        };
        if (!ress) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Asignacion no encontrado'
                }
            });
        }
        res.json(ress).status(200)
    });

});


module.exports = app;