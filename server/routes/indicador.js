const express = require('express');
const _ = require ('underscore');


// constantes
const app = express();


// Recursos
const Indicador =  require ('../models/indicador'); 
const { verificaToken, verificaRol } = require('../middlewares/autenticacion');


app.get('/Indicadores',[verificaToken, verificaRol ],(req, res) => {

    Indicador.find()
        .exec((err, indicadores) => {
            if (err) {
                return res.status(400).json(err);
            }
           res.json(indicadores)
        });
});
app.get('/Indicador/:Metrica',[verificaToken, verificaRol ],(req, res) => {
    let Metrica = req.params.Metrica;
    Indicador.find({Metrica: Metrica})
        .exec((err, indicadores) => {
            if (err) {
                 res.status(400).json(err);
            }
           res.json(indicadores)
        });
});
app.post('/Indicador',[verificaToken, verificaRol ],function(req,res){
    let body = req.body;

    let indicador = new Indicador({
        Empresa: body.Empresa,
        Zona: body.Zona,
        Metrica: body.Metrica,
        Indicador: body.Indicador,
    });
    Indicador.findOne({Empresa:body.Empresa, Zona: body.Zona,Metrica: body.Metrica,Indicador: body.Indicador},(err,indi)=>{
        if(!indi){
            indicador.save( (err,indiDB)=>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                //usuarioDB.password = null;
                res.json({
                    ok: true,
                    Indicador: indiDB
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
app.put('/Indicador/:id',[verificaToken, verificaRol ], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['Empresa','Zona', 'Departamento', 'Estado'])  ;

    Zona.findByIdAndUpdate( id, body, { new: true, runValidators: true } ,(err, indicadorDB) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            empresa: indicadorDB
        });
    })
    
});

app.delete('/Indicador/:id', [verificaToken, verificaRol ],function(req, res) {
    let id = req.params.id;
    let cambiaEstado ={
        Estado: 'I'
    }
    Indicador.findByIdAndDelete(id, (err, indicadorBorrado)=>{
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
                    message: 'Indicador no encontrado'
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