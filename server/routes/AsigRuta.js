const express = require('express');
const app = express();
const moment = require('moment-timezone');
const control = moment.tz(Date.now(), "America/Lima").format('YYYY-MM-DD');
const AsigRuta =  require ('../models/AsigRuta'); 
const Asignaciones =  require ('../models/asignacion');
const Trabajador =  require ('../models/usuario');
const { verificaToken, verificaRol } = require('../middlewares/autenticacion');
//  REGISTRAR NUEVA ASIGNACION DE RUTA
app.post('/AsigRuta',[verificaToken, verificaRol ], function(req,res){
    let body = req.body;

    let funcion = new AsigRuta({
        Trabajador : body.Trabajador,
        Estado: body.Estado,
        Ruta: body.Ruta
    });
    AsigRuta.findOne({Ruta: body.Ruta, Trabajador: body.Trabajador}, (err,asig)=>{
        if(!asig){
            funcion.save((err,asigDB)=>{
                if(err){
                    return res.status(401)
                }
                AsigRuta.updateMany({Ruta:body.Ruta, Trabajador:{$ne:body.Trabajador}},{Estado: 'Inactivo'},{new: true} ,(err,  rutacambiar)=>{
                    if(err){
                        res.status(401).json('Registro e inactivar masivo')
                    }
                    return res.json({
                        Asignacion: asigDB,
                        Update: rutacambiar
                    });
                })
                       
                    })
        }else{
          return  res.status(400).json('Ya se encuentra registrado')}
    })
    
        });

// LISTA TODAS LAS ASIGNACION DE RUTAS
app.get('/AsigRutas', (req,res)=>{
    
    AsigRuta.find({})
    .exec(function (err, asignaciones) {
        if (err){ 
            return res.status(401);
        }
       res.json(asignaciones)
    });
});

// LISTAR RUTAS POR TRABAJADOR
app.get('/RutasDisponibles/:nombre',[verificaToken ], (req,res)=>{
    let nombre = req.params.nombre
    AsigRuta.find({Trabajador: nombre, Estado: 'Activo' })
    .exec((err,result)=>{
        if(err){
            res.status(401)
        }
        res.json(result)
    })
});
// lISTA DE ASIGNACIONES POR RUTA
app.get('/AsignacionesRuta/:ruta', [verificaToken, ver ],(req,res)=>{
    let ruta = req.params.ruta

    Asignaciones.find({Ruta: ruta, Fecha:{$ne : control}})
    .exec((err,result)=>{
        if(err){
            res.status(401)
        }
        res.json(result)
    })
});
// BUSCAR PARA INACTIVAR
app.get('/AsigRutasU/:id',[verificaToken, verificaRol ] , (req,res)=>{
    let id = req.params.id
    let rutas = req.params.Rutas
   AsigRuta.findById({_id:id})
   .exec((err,ress)=>{
       if(err){
           res.status(403)
       }
       if(ress.Estado === 'Activo'){
           AsigRuta.findByIdAndUpdate(id, {Estado: 'Inactivo'},{new: true} ,(err,  rutacambiada)=>{
            if(err){
                return res.status(403).json({
                    ok: false,
                    err
                });
            };
            if (!rutacambiada){
                return res.status(404).json({
                    ok:false,
                    error:{
                        message: 'Estado no encontrada'
                    }
                });
            }
            Asignaciones.updateMany({Ruta: ress.Ruta}, {Fecha: '0'},{new: true} ,(err,  actualizarA)=>{
                if(err){
                    res.status(500).json('No se pudo actualizar la fecha')
                }
                res.json({
                    ok: true,
                    usuario: rutacambiada,
                    Fecha: actualizarA
                })
            })
            
           })

       }
       if(ress.Estado === 'Inactivo'){
        AsigRuta.findByIdAndUpdate(id, {Estado: 'Activo'},{new: true} ,(err,  rutacambiadaI)=>{
         if(err){
             return res.status(403).json({
                 ok: false,
                 err
             });
         };
         if (!rutacambiadaI){
             return res.status(404).json({
                 ok:false,
                 error:{
                     message: 'Estado no encontrada'
                 }
             });
         }
         AsigRuta.updateMany({_id:{$ne:id},Ruta: ress.Ruta}, {Estado:'Inactivo'},{new: true} ,(err,  rutacambiadaT)=>{
            if(err){
                res.status(400).json('no se puedo inactivar el resto')
            }
            Asignaciones.updateMany({Ruta: ress.Ruta},{Fecha:'0'}, {new: true},(err, cero)=>{
                if(err){
                    res.json('Fecha 0').status(500)
                }
                res.json({
                    ok: true,
                    usuario: rutacambiadaI,
                    Todos: rutacambiadaT,
                    Cero: cero
                })
            })
            
         })
         
        })

    }
   })
});
// ELIMINAR ASIGNACION DE RUTA
app.delete('/AsigRutaE/:id',[verificaToken, verificaRol ],  function(req, res) {
    let id = req.params.id;
        AsigRuta.findByIdAndDelete(id ,(err,  AsignacionBorrada)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!AsignacionBorrada){
            return res.status(404).json({
                ok:false,
                error:{
                    message: 'Asignacion no encontrado'
                }
            });
        }
        res.json(AsignacionBorrada).status(200)
        // ELIMINAR DE LA RUTA
      
});});
module.exports = app;