const express = require('express');
const _ = require ('underscore');
const moment = require('moment-timezone');
let dateLima = moment.tz('America/Lima').format('DD/MM/YYYY HH:mm');
const control = moment.tz(Date.now(), "America/Lima").format('DD/MM/YYYY');
// constantes
const app = express();


// Recursos
const Asignacion =  require ('../models/asignacion'); 

app.get('/solucion/nombreAsig/:Nombre',(req,res)=>{
    let Nombre = req.params.Nombre;
    Asignacion.find({Nombre : Nombre})
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

module.exports = app;
