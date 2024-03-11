import Categoria from './categoria.model.js';
import Admin from '../administradores/administrador.model.js'
import jwt from 'jsonwebtoken';




const categoriaPredeterminada = {
    nombreCategoria: 'Predeterminada',
    descripcion: 'Categoria Predeterminada'
}

export const crearCategoriaPredeterminada = async (req, res) =>{
    try{
        const solounavez = await Categoria.findOne({nombreCategoria: categoriaPredeterminada.nombreCategoria})
        if(solounavez){
            console.log('Ya existe la categoria predeterminada')
        }else{
            await Categoria.create(categoriaPredeterminada)
            console.log('Se creo la categoria predeterminada')
        }
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error al crear la categoria'})
    }
}


export const categoriaGet = async (req, res) => {
    const { limite, desde } = req.query;
    const query = {};

    try {
        const [totalCategorias, categoria] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            totalCategorias,
            categoria
        });

    } catch (e) {
        console.error(e);
        res.status(400).json({
            msg: "Ocurrió un error inesperado"
        });
    }
};

export const categoriaPost = async (req, res) => {
    const { nombreCategoria, descripcion } = req.body;
    const token = global.tokenAcces;
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const admin1 = await Admin.findById(uid);

        console.log(admin1);

        if (!admin1) {
            return res.status(403).json({ msg: 'No tienes permisos para realizar esta acción' });
        }

        const categoria = new Categoria({ nombreCategoria, descripcion });

        await categoria.save();

        res.status(200).json({
            categoria
        });

    } catch (error) {
        console.error('Error al crear una nueva categoria:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};


export const categoriaPut = async (req, res) => {
    const { nombreCategoria, descripcion } = req.body;
    const token = global.tokenAcces;
    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const admin1 = await Admin.findById(uid);

        console.log(admin1);

        if (!admin1) {
            return res.status(403).json({ msg: 'No tienes permisos para realizar esta acción' });
        }
        
        const categoria = await Categoria.findOne({ nombreCategoria });

        if (!categoria) {
            return res.status(404).json({
                msg: 'Categoría no encontrada',
            });
        }

        categoria.descripcion = descripcion;

        await categoria.save();

        res.status(200).json({
            msg: 'Categoría Actualizada',
            categoria,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error en el servidor',
        });
    }
};


export const categoriaDelete = async (req, res) => {
    const { nombreCategoria } = req.body;
    const token = global.tokenAcces;

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const admin1 = await Admin.findById(uid);

        if (!admin1) {
            return res.status(403).json({ msg: 'No tienes permisos para realizar esta acción' });
        }

        const categoriaEliminada = await Categoria.findOneAndDelete({ nombreCategoria }, { new: true } 
        );

        if (!categoriaEliminada) {
            return res.status(404).json({ msg: 'Categoría no encontrada o ya eliminada' });
        }


        res.status(200).json({ msg: 'Categoría eliminada', categoriaEliminada });
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

