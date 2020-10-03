const express = require ('express');
const app = express();
const moment = require('moment-timezone');
let mes = moment.tz('America/Lima').format('MMMM');
//Modelos
const Respuesta = require('../models/Evaluacion-Resp');
const Evaluaciones = require('../models/Evaluaciones');
// Validaciones
const { verificaToken, verificaRol } = require('../middlewares/autenticacion');

// VALORES DE EVALUACION
app.post('/Evaluacion', (req,res)=>{
    let body = req.body;

    let evaluaciones= new Evaluaciones({
        Index : body.Index,
        Evaluacion : body.Evaluacion
    })
    evaluaciones.save((err,resul)=>{
        if(err){
        res.status(500)}
        res.json(resul)
        console.log(body)
    })
})

// RESPUESTA EVALUACION
app.post('/RespuestaEvaluacion', (req,res)=>{
    
    let body = req.body;

    let respuesta= new Respuesta({
        Area: 'Seguridad',
        IndexE : body.IndexE,
        Trabajador : body.Trabajador,
        Funcion : body.Funcion,
        Indicador : body.Indicador,
        Calificacion : body.Calificacion,
        Mes: mes,
        FechaC: body.FechaC
    })
    Respuesta.findOne({Trabajador: body.Trabajador, Mes: body.Mes})
    .exec((err,result)=>{
        if(err){
            res.status(401)
        }
        if(result){
            res.status(403).json('Ya se encuentra registrado')
        }
        if(!result){
            respuesta.save((err, result2)=>{
                if(err){
                    res.status(500)
                }
                console.log(result2)  
                console.log(body)           
            })
        }
    })
    
});

app.get('/mes', (req,res)=>{
    console.log(mes)
})
module.exports = app;