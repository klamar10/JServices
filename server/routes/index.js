const express = require('express');
// CONSTANTES
const app = express();

//RUTAS
app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./empresa'));
app.use(require('./zonas'));
app.use(require('./indicador'));
app.use(require('./metricas'));
app.use(require('./asignacion'));
app.use(require('./asig_rspta'));
app.use(require('./soluciones'));
app.use(require('./ruta'));
app.use(require('./AsigRuta'));
app.use(require('./Respuesta'));
//app.use(require('../Controller/Reportes'));

//app.use(require('../Controller/Evaluaciones.controller'));
//EXPORT
module.exports = app;