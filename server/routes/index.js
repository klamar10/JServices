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

//EXPORT
module.exports = app;