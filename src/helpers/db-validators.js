import Admin from '../administradores/administrador.model.js';
import Categoria from '../categoria/categoria.model.js';
import Producto from '../producto/producto.model.js';

export const existeEmail = async (correo = '', modelo) => {
    const existeEmail = await modelo.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El email ${correo} ya fue registrado`);
    }
};

export const existeUsuario = async (usuario = '' ) => {
    const existeUsuario = await Admin.findOne({ usuario });
    if (existeUsuario) {
        throw new Error(`El usuario ${usuario} ya fue registrado`);
    }
};

export const existeCategoria = async (nombreCategoria = '' ) => {
    const existeCategoria = await Categoria.findOne({ nombreCategoria });
    if (existeCategoria) {
        throw new Error(`La categoria ${nombreCategoria} ya fue registrada`);
    }
};

export const existeProducto = async (nombre = '' ) => {
    const existeProducto = await Producto.findOne({ nombre });
    if (existeProducto) {
        throw new Error(`El producto ${nombre} ya fue registrada`);
    }
};
