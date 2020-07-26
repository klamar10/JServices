const express = require('express');
const bcrypt = require('bcryptjs');
var  jwt  = require ( 'jsonwebtoken' ) ;

// MODELOS 
const Usuario =  require ('../models/usuario'); 

// CONSTANTES
const app = express();

// PETICIONES

app.post('/login', (req, res) =>{
    
    let body  = req.body;

    Usuario.findOne( {email: body.email}, (err, usuarioDB) =>{
        
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: '(Usuario) o contraseña incorrecto'
                }
            });
        }

        if ( !bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario o (contraseña) incorrecto'
                }
            });
        }
        let token =  jwt.sign({
            usuario: usuarioDB 
          }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN}); //60*60*24*30 -- Para 30 dias
 
          
        res.json({
            ok:true,
            usuario: usuarioDB,
            token
        })

    })
    
});

module.exports = app;