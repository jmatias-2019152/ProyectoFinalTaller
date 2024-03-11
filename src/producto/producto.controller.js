import Producto from './producto.model.js';
import Categoria from '../categoria/categoria.model.js';
import Admin from '../administradores/administrador.model.js'
import jwt from 'jsonwebtoken';



export const productoGet = async (req, res) => {
    const { limite, desde } = req.query;
    const query = {};

    try {


        const [totalProductos, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            totalProductos,
            productos
        });

    } catch (e) {
        console.error(e);
        res.status(400).json({
            msg: "Ocurrió un error inesperado"
        });
    }
};


export const productoGetByNombre = async (req, res) => {
    const { nombre } = req.body;


    console.log(nombre)
    try {

        const producto = await Producto.findOne({ nombre: nombre });

        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        res.status(200).json({
            producto
        });

    } catch (error) {
        console.error('Error al buscar el producto por Nombre:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};


export const productoGetById = async (req, res) => {
    const { id } = req.body;

    try {

        const producto = await Producto.findOne({ _id: id });

        console.log(id);

        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        res.status(200).json({
            producto
        });

    } catch (error) {
        console.error('Error al buscar el producto por ID:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

export const productoGetPorCategoria = async (req, res) => {
        const { idCategoria } = req.body;
    try {
        
        const producto = await Producto.find({ categoria: idCategoria });
        return res.send({ message: 'Productos encontrados:', producto });
    } catch (error) {
        console.error('Error al buscar el producto por categoria:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};


export const productoPost = async (req, res) => {
    const { nombre, precio, descripcion, stock, categoria } = req.body;
    const token = global.tokenAcces;

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const admin1 = await Admin.findById(uid);

        console.log(admin1);

        if (!admin1) {
            return res.status(403).json({ msg: 'No tienes permisos para realizar esta acción' });
        }

        const producto = new Producto({ nombre, precio, descripcion, stock, categoria});

        const categoria1 = await Categoria.findOne({_id: categoria})

        if (!categoria1) {
            return res.status(404).json({ message: 'No existe esa categoría' });
        }

        await producto.save();

        res.status(200).json({
            msg: 'Producto creado exitosamente',
            producto,
        });

    } catch (error) {
        console.error('Error al crear un nuevo producto:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

export const productoPut = async (req, res) => {
    const { id, nombre, precio, descripcion, stock, categoria } = req.body;
    const token = global.tokenAcces;

    console.log(req.body);

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const admin1 = await Admin.findById(uid);

        console.log(admin1);

        if (!admin1) {
            return res.status(403).json({ msg: 'No tienes permisos para realizar esta acción' });
        }
        
        const producto = await Producto.findById(id);

        if (!producto) {
            return res.status(404).json({
                msg: 'Producto no encontrado',
            });
        }

        producto.nombre = nombre;
        producto.precio = precio;
        producto.descripcion = descripcion;
        producto.stock = stock;
        producto.categoria = categoria;

        await producto.save();

        res.status(200).json({
            msg: 'Producto Actualizado',
            producto,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error en el servidor',
        });
    }
};

export const productoDelete = async (req, res) => {
    const { id } = req.body;
    const token = global.tokenAcces;

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const admin1 = await Admin.findById(uid);

        if (!admin1) {
            return res.status(403).json({ msg: 'No tienes permisos para realizar esta acción' });
        }

        const productoEliminado = await Producto.findOneAndDelete({ _id: id }, { new: true } 
        );

        if (!productoEliminado) {
            return res.status(404).json({ msg: 'Categoría no encontrada o ya eliminada' });
        }


        res.status(200).json({ msg: 'Producto eliminado', productoEliminado });
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};
