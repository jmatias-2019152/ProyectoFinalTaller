import Admin from '../administradores/administrador.model.js'

export const existeEmail = async (correo = '', modelo) => {
    const existeEmail = await modelo.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El email ${correo} ya fue registrado`);
    }
};

export const existeUsuario = async (usuario = '' ) => {
    const existeEmail = await Admin.findOne({ usuario });
    if (existeEmail) {
        throw new Error(`El usuario ${usuario} ya fue registrado`);
    }
};