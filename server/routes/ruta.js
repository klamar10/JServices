const express = require('express');
const app = express();

const Rutas =  require ('../models/rutas'); 
const { verificaToken, verificaRol } = require('../middlewares/autenticacion');
// OBTENER TODAS LAS RUTAS
app.get('/Rutas', [verificaToken, verificaRol ],(req,res)=>{
    Rutas.find().exec((err,rutas)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json(rutas)
    })
})
// OBTENER RUTAS ACTIVAS
app.get('/Rutas-Activas', [verificaToken, verificaRol ],(req,res)=>{
    Rutas.find({Estado: 'Activo'}).exec((err,rutas)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json(rutas)
    })
})
// CREAR RUTA
app.post('/Ruta', [verificaToken, verificaRol ],function(req,res){
    
    let body = req.body;

    let ruta = new Rutas({
        Ruta   : body.Ruta,
        Estado : body.Estado
    });
    ruta.save((err,ruta)=>{
        if(err){
            return res.status(500)
        }
        res.json(ruta)
    });
});
//ELIMINAR RUTA
app.delete('/Ruta-Eliminar/:id',[verificaToken, verificaRol ],function(req,res){
    let id = req.params.id;
    Rutas.findByIdAndDelete(id ,(err,  usuarioBorrado)=>{
    if(err){
        return res.status(500).json({
            ok: false,
            err
        });
    };
    if (!usuarioBorrado){
        return res.status(401).json({
            ok:false,
            error:{
                message: 'Ruta no encontrado'
            }
        });
    }
    res.json({
        ok: true,
        usuario: usuarioBorrado
    });
});
})
// ACTIVAR RUTA
app.get('/RutasU/:id',[verificaToken, verificaRol ], (req,res)=>{
    let id = req.params.id
    Rutas.findById({_id: id})
    .exec((err, resultado)=>{
        if(err){
            res.status(500)
        }
        
        if(resultado.Estado === 'Activo'){
            Rutas.findOneAndUpdate({_id: id},{Estado: 'Inactivo'}).exec((err, rut)=>{
               if(err){
                   res.status(401);
               }
                return  res.json(rut)               
            });
        } else{Rutas.findOneAndUpdate({_id: id},{Estado: 'Activo'}).exec((err, ac)=>{
              return  res.json(ac)
            
        });}
    });
});
module.exports = app;