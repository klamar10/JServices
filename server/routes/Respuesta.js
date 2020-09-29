const express = require('express');
const _ = require('underscore');
const moment = require('moment-timezone');
let dateLima = moment.tz('America/Lima').format('DD/MM/YYYY HH:mm');
const control = moment.tz(Date.now(), "America/Lima").format('YYYY-MM-DD');
var GPS = require('gps');
var gps = new GPS;
const app = express();

//datos
const Asignacion =  require ('../models/asignacion'); 
const Respuesta = require('../models/respuestas');
const Usuario = require('../models/usuario');
const { verificaToken, verificaRol } = require('../middlewares/autenticacion');
// REGISTRAR RESPUESTA
app.post('/AsigRpta', [verificaToken],(req,res)=>{
    let ctr = control;
    let body = req.body;
    let respuesta = new Respuesta({
        Empresa : body.Empresa,
        Zona : body.Zona,
        Metrica : body.Metrica,
        Indicador : body.Indicador,
        Ruta : body.Ruta,
        Trabajador :body.Trabajador,

        Condicion: body.Condicion,
        Tipo: body.Tipo,
        Comentarios: body.Comentarios,
        FechaR: body.FechaR,
        FechaC: ctr,
        Asignaciones: body.asigID
    });
    respuesta.save( (err,resp)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        Asignacion.findByIdAndUpdate({_id: body.asigID},{Fecha: control},{new: true} ,(err,  actualizarA)=>{
            if(err){
                res.status(500).json('No se pudo actualizar la fecha de la asignacion')
            }
            res.json({
                ok: true,
                Respuesta: resp,
                Asignacion:   actualizarA
        })
                     
            });
            //})
            
        
    });
    //return res.json(asignacion)
    
});
app.get('/Respuestas', verificaToken,(req, res) => {

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
app.post('/Reporte',[verificaToken, verificaRol ],(req, res)=> {
   /* let body  =req.body;
    let buscar = new Respuesta({
        Empresa : body.Empresa,
        Ruta : body.Ruta,
        FechaInicio : body.FechaInicio,
        FechaFin: body.FechaFin
    })    */
    let Empresa = req.body.Empresa
    let Ruta = req.body.Ruta
    let FechaInicio = req.body.FechaInicio
    let FechaFin = req.body.FechaFin

    Respuesta.find(
        {
            
            $and:[
                {Empresa: Empresa},
                {Ruta: Ruta},
                {FechaC:{$gte:FechaInicio}},
                {FechaC:{$lte:FechaFin}}
            ]
            
        })
    .exec((err,resul)=>{
        if(err){
            res.json('nel')
        }
        res.json(resul)
    });
    
    
});
module.exports = app;