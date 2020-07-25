// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  Base de datos
// ============================

let urlDB;

    if ( process.env.NODE_ENV  === 'dev' ){
        urlDB = 'mongodb://localhost:27017/dova'
    }else{
        urlDB = process.env.MONGO_URL; 
        // urlDB ='mongodb+srv://admin:Macarena24@cluster0.sie6u.mongodb.net/dova';
   }
    process.env.URLDB = urlDB;