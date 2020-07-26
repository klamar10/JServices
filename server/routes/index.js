const express = require('express');
// CONSTANTES
const app = express();

//RUTAS
app.use(require('./usuario'));
app.use(require('./login'));




//EXPORT
module.exports = app;