import jwt from 'jsonwebtoken';

import Admin from '../administradores/administrador.model.js';
import Cliente from '../cliente/cliente.model.js'


export const validarJWT = async (req, res, next) => {

    const token = global.tokenAcces;

    if (!token) {
        return res.status(401).json({
            msg: "Iniciar sesion para poder continuar con esta funcion"
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        try {
            const admin = await Admin.findById(uid);
            const cliente = await Cliente.findById(uid);

            let user;

            if (admin) {
                user = admin;
            } else if (cliente) {
                user = cliente;
            } else {
                return res.status(401).json({
                    msg: "Usuario no existe en la base de datos",
                });
            }

            if (!user.estado) {
                return res.status(401).json({
                    msg: `Token no válido - ${user.constructor.modelName} esta inhabilitado`,
                });
            }

            next();
        } finally { }
    } catch (e) {
        console.log(e),
            res.status(401).json({
                msg: "Token no válido",
            });
    }


};

