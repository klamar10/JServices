require('./config/config');

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//CORS
app.use(cors());

// parse application/json
app.use(bodyParser.json())

// RUTAS global
app.use('/api',require('./routes/index.js'));


mongoose.connect(process.env.URLDB, 
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err,res) =>{


    if (err) throw err;
    console.log('Base de datos conectado');
});
  
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});