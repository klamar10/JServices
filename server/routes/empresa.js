const express = require('express');
const _ = require ('underscore');


// constantes
const app = express();


// Recursos
const Empresa =  require ('../models/empresa'); 
const { verificaToken, verificaRol } = require('../middlewares/autenticacion');


app.get('/Empresas',[verificaToken, verificaRol ],(req, res) => {

    Empresa.find()
        .exec((err, empresas) => {
            if (err) {
                return res.status(400).json(err);
            }
           res.json(empresas)
        });
});
app.get('/EmpresaA',[verificaToken, verificaRol ],(req, res) => {

    Empresa.find({Estado : 'Activo'},'Ruc Nombre Departamento')
        .exec((err, empresas) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
           res.json(empresas)
        });
});
app.get('/Empresa/:id',[verificaToken, verificaRol ],(req, res) => {

    let id = req.params.id
    Empresa.findOne({_id: id},(err, usuarios)=> {
            if (err) {
                return res.status(400).json(err);
            }
           res.json(usuarios)
        });
});
app.post('/Empresa',[verificaToken, verificaRol ],function(req,res){
    let body = req.body;

    let empresa = new Empresa({
        Ruc: body.Ruc,
        Nombre: body.Nombre,
        Departamento: body.Departamento,
        Estado: body.Estado
    });
    empresa.save( (err,empresaDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //usuarioDB.password = null;
        res.json({
            ok: true,
            empresa: empresaDB
        });
    });
});
app.put('/Empresa/:id', [verificaToken, verificaRol ],function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['Ruc','Nombre', 'Departamento', 'Estado'])  ;

    Empresa.findByIdAndUpdate( id, body, { new: true, runValidators: true } ,(err, empresaDB) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            empresa: empresaDB
        });
    })
    
});

app.delete('/Empresa/:id',[verificaToken, verificaRol ], function(req, res) {
    let id = req.params.id;
    let cambiaEstado ={
        Estado: 'I'
    }
    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
        Empresa.findByIdAndUpdate(id,cambiaEstado,{new: true} ,(err,  estadoBorrado)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!estadoBorrado){
            return res.status(400).json({
                ok:false,
                error:{
                    message: 'Empresa no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            empresa: estadoBorrado
        })
    })

});



module.exports = app;