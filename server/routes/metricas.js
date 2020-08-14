const express = require('express');
const _ = require ('underscore');

const moment = require('moment-timezone');
const dateLima= moment.tz(Date.now(), "America/Lima").format('DD-MM-YYYY');

// constantes
const app = express();


// Recursos
const Metrica =  require ('../models/metrica'); 
const { verificaToken, verificaRol } = require('../middlewares/autenticacion');


app.get('/Metricas',(req, res) => {

    Metrica.find()
        .exec((err, metricas) => {
            if (err) {
                return res.status(400).json(err);
            }
           res.json(metricas)
        });
});
app.get('/Metrica/:zona' ,(req, res)=> {
    let zona = req.params.zona;
    Metrica.find({Zona : zona})
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
app.post('/Metrica',function(req,res){
    let body = req.body;

    let metrica = new Metrica({
        Empresa: body.Empresa,
        Zona: body.Zona,
        Metrica: body.Metrica
    });
    Metrica.findOne({Empresa:body.Empresa, Zona: body.Zona,Metrica: body.Metrica},(err,metricar)=>{
        if(!metricar){
            metrica.save( (err,metDB)=>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                //usuarioDB.password = null;
                res.json({
                    ok: true,
                    Metrica: metDB
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
app.put('/Metrica/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['Empresa','Zona', 'Metrica', 'Estado'])  ;

    Metrica.findByIdAndUpdate( id, body, { new: true, runValidators: true } ,(err, metricaDB) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            metrica: metricaDB
        });
    })
    
});

app.delete('/Metrica/:id', function(req, res) {
    let id = req.params.id;
    let cambiaEstado ={
        Estado: 'I'
    }
    Metrica.findByIdAndDelete(id, (err, metricaB)=>{
      //  Empresa.findByIdAndUpdate(id,cambiaEstado,{new: true} ,(err,  estadoBorrado)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!metricaB){
            return res.status(400).json({
                ok:false,
                error:{
                    message: 'Indicador no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            Metrica: metricaB
        })
    })

});



module.exports = app;