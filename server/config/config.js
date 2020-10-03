// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  Vencimiento de token
// ============================
// 60s * 60m * 24hr  * 30d

process.env.CADUCIDAD_TOKEN=60 * 60 *24* 2;

// ============================
//  SEED de autenticacion
// ============================

process.env.SEED= process.env.SEED || 'secret'

// ============================
//  Base de datos
// ============================

let urlDB;

  if ( process.env.NODE_ENV  === 'dev' ){
      urlDB = 'mongodb://localhost:27017/dova'
   }else{
      urlDB = process.env.MONGO_URL; 
       urlDB ='mongodb+srv://admin:Macarena24@cluster0.sie6u.mongodb.net/dova';
   }
    process.env.URLDB = urlDB;