const express = require ('express');
const app = express();

//Modelos
const Respuesta = require('../models/respuestas');
// Validaciones
const { verificaToken, verificaRol } = require('../middlewares/autenticacion');

// REPORTE DE TRABAJO DIARIO

app.post('/TrabajoDiario', (req,res)=>{
    let Fecha = req.body.Fecha
    let Nombre = req.body.Nombre
    let Ruta = req.body.Ruta
    if(Ruta == ""){
        Respuesta.find({Trabajador: Nombre, FechaC: Fecha})
        .exec((err,result1)=>{
            if(err){
                res.status(401).json('Necesita login')
            }
            res.json(result1)
        });
    }
    else{
    Respuesta.find({Trabajador: Nombre, FechaC: Fecha, Ruta:Ruta})
    .exec((err,result2)=>{
        if(err){
            res.status(401).json('Necesita login')
        }
        return res.json(result2)
    });
}
});
app.post('/TrabajoDiarioCount', (req,res)=>{
    let Fecha = req.body.Fecha
    let Nombre = req.body.Nombre
    let Ruta = req.body.Ruta
    if(Ruta == ""){
        Respuesta.countDocuments({Trabajador: Nombre, FechaC: Fecha})
        .exec((err,result2)=>{
            if(err){
                res.status(401).json('Necesita login')
            }
            res.json(result2)
        });
    }
    else{
        Respuesta.countDocuments({Trabajador: Nombre, FechaC: Fecha, Ruta: Ruta})
        .exec((err,result2)=>{
            if(err){
                res.status(401).json('Necesita login')
            }
            res.json(result2)
        });
    }

});
app.get('/ContadorTotal', (err,res)=>{

    var agg = [
        {
            $match : { Ruta: { $ne : null}  }
          },
        {$group: {
          _id: "$Trabajador",
          value: { $sum: 1 }
        }}
      ];
    
      Respuesta.aggregate(agg, function(err, logs){
        if (err) {  res.json(err); }
    
        res.json(logs);
      });
})
/////// RUTAS REALIZADAS
app.post('/RutasRealizadas', (req,res)=>{
    let Fecha = req.body.Fecha
    let Ruta = req.body.Ruta
    if(Ruta == ""){
        var agg = [
            {
                $match : { Ruta: { $ne : null}  }
              },
            {$group: {
              _id: "$Trabajador",
              value: { $sum: 1 }
            }}
          ];
    }else{
    var agg = [
        {
            $match : { Ruta: Ruta }
          },
        {$group: {
          _id: "$Trabajador",
          value: { $sum: 1 }
        }}
      ];}
      Respuesta.aggregate(agg, function(err, logs){
        if (err) {  res.json(err); }
    
        res.json(logs);
      });

});
app.get('/RutasRealizadasx', (err,res)=>{

    var agg = [
        {
            $match : { Ruta: { $ne : null}  }
          },
        {$group: {
          _id: "$Ruta",
          value: { $sum: 1 }
        }}
      ];
    
      Respuesta.aggregate(agg, function(err, logs){
        if (err) {  res.json(err); }
    
        res.json(logs);
      });
})
module.exports = app;