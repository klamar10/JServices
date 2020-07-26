const jwt  = require ('jsonwebtoken');


//===================
// Verificar token
//===================

let verificaToken = (req, res, next) =>{

    let token = req.get('token');

    jwt.verify( token, process.env.SEED, ( err, decoded) =>{
        if( err ){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();

    });


};
//===================
// Verificar Admin Rol
//===================

let verificaRol = (req, res, next) =>{
    let usuario = req.usuario;

    if (usuario.roles === 'Administrador') {
        next();
    } else{
       return res.json({
            ok: false,
            err: {
                message: 'Usuario no permitido'
            }
        })
    }
}

module.exports = {
    verificaToken,
    verificaRol
}