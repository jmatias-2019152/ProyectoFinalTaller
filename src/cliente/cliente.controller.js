import Cliente from "./cliente.model.js";
import bcrypt from "bcryptjs"
import jwt  from "jsonwebtoken";


export const clientePost = async (req, res) => {
    const { nombre, correo, password } = req.body;
    const cliente = new Cliente({ nombre, correo, password });

    const salt = bcrypt.genSaltSync();
    cliente.password = bcrypt.hashSync(password, salt);

    await cliente.save();

    res.status(200).json({
        cliente,
    });
};

export const clientePut = async (req, res) => {
    const { correo: correoActualizado, nombre, password } = req.body;
    const token = global.tokenAcces;

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const clienteExistente = await Cliente.findById(uid);

        if (!clienteExistente) {
            return res.status(403).json({ msg: 'No tienes permisos para realizar esta acción' });
        }

        if (!clienteExistente || !clienteExistente.estado) {
            return res.status(404).json({ msg: "Cliente no encontrado o no activo" });
        }

        const salt = bcrypt.genSaltSync();
        const contraseñaEncriptada = bcrypt.hashSync(password, salt);

        const clienteActualizado = {
            nombre: nombre !== undefined ? nombre : clienteExistente.nombre,
            password: contraseñaEncriptada !== clienteExistente.password ? contraseñaEncriptada : clienteExistente.password
        };

        const contraseñasIguales = await bcrypt.compare(password, clienteExistente.password);

        if (clienteActualizado.nombre === clienteExistente.nombre && contraseñasIguales) {
            return res.status(400).json({ msg: "No hubo cambios para actualizar" });
        }

        const clienteActualizadoDB = await Cliente.findOneAndUpdate({ _id: uid, correo: correoActualizado, estado: true }, 
            clienteActualizado, { new: true }
        );

        if (!clienteActualizadoDB) {
            return res.status(404).json({ msg: "Cliente no encontrado o no activo" });
        }

        res.status(200).json({
            msg: "Los datos han sido actualizados",
            cliente: clienteActualizadoDB
        });
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};


export const clienteDelete = async (req, res) => {
    const { correo } = req.body;
    const token = global.tokenAcces;

    try {
        
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const cliente = await Cliente.findById(uid);

        if (!cliente) {
            return res.status(403).json({ msg: 'No tienes permisos para realizar esta acción' });
        }

        if (cliente.correo === correo) {
            await Cliente.findByIdAndUpdate(uid, { estado: false });
            global.tokenAcces = '';
            res.status(200).json({
                msg: "Perfil Eliminado"
            });
        } else {
            res.status(403).json({
                msg: "No tienes permisos para eliminar esta cuenta"
            });
        }
    } catch (e) {
        console.error(e);
        res.status(400).json({
            msg: "Ocurrió un error inesperado"
        });
    }
};

