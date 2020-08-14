const express = require('express');
const _ = require ('underscore');


// constantes
const app = express();


// Recursos
const Empresa =  require ('../models/empresa'); 


app.get('/Empresas',(req, res) => {

    Empresa.find()
        .exec((err, empresas) => {
            if (err) {
                return res.status(400).json(err);
            }
           res.json(empresas)
        });
});
app.get('/EmpresaA',(req, res) => {

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
app.get('/Empresa/:id',(req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['Ruc','Nombre', 'Departamento', 'Estado'])  ;

    Empresa.findById( id, body ,(err, empresaDB) =>{
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
app.post('/Empresa',function(req,res){
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
app.put('/Empresa/:id', function(req, res) {

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

app.delete('/Empresa/:id', function(req, res) {
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