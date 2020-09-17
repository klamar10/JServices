require('./config/config');
const moment = require('moment-timezone');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
let dateLima = moment.tz('America/Lima').format('DD/MM/YYYY HH:mm');
//var localDate = moment(dateLima).utcOffset(10 * 60);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
var june = moment("2020-09-17T24:00:00");
console.log(moment.tz('America/Lima').format('HH:mm z'))
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
    console.log('Base de datos conectado'+ process.env.URLDB);
});
  
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT, dateLima);
});