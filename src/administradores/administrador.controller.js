import Admin from "./administrador.model.js";
import Cliente from '../cliente/cliente.model.js'
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
 

export const adminPost = async (req, res) => {
    const { nombre, usuario, correo, password } = req.body;
    const token = global.tokenAcces;
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const admin1 = await Admin.findById(uid);

        if (!admin1) {
            return res.status(403).json({ msg: 'No tienes permisos para realizar esta acción' });
        }

        const rol = admin1.rol;

        if (rol === 'ADMIN') {
            const admin = new Admin({ nombre, usuario, correo, password });

            const salt = bcrypt.genSaltSync();
            admin.password = bcrypt.hashSync(password, salt);
            
            await admin.save();

            res.status(200).json({
                admin,
            });
        } else {
            res.status(403).json({ msg: 'No tienes permisos para realizar esta acción' });
        }
    } catch (error) {
        console.error('Error al crear un nuevo administrador:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

export const activarCliente = async (req, res) => {
    const { correo } = req.body;
    const token = global.tokenAcces;

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const admin1 = await Admin.findById(uid);

        if (!admin1) {
            return res.status(403).json({ msg: 'No tienes permisos para realizar esta acción' });
        }

        const cliente = await Cliente.findOneAndUpdate({ correo: correo }, { estado: true });

        if (!cliente) {
            return res.status(404).json({
                msg: "Cliente no encontrado"
            });
        }

        if (cliente.estado === true) {
            return res.status(400).json({
                msg: "Usuario ya activo"
            });
        }

        res.status(200).json({
            msg: "Perfil Activado"
        });
    } catch (e) {
        console.error(e);
        res.status(400).json({
            msg: "Ocurrió un error inesperado"
        });
    }
};

export const putClienteAdmin = async (req, res) => {
    const { correo, nombre, password } = req.body;
    const token = global.tokenAcces;

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const admin1 = await Admin.findById(uid);

        if (!admin1) {
            return res.status(403).json({ msg: 'No tienes permisos para realizar esta acción' });
        }

        const rol = admin1.rol;

        if (rol !== 'ADMIN') {
            return res.status(403).json({
                msg: "No tienes permisos para realizar esta acción"
            });
        }

        const clienteExistente = await Cliente.findOne({ correo });

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

        const clienteActualizadoDB = await Cliente.findOneAndUpdate({ _id: clienteExistente._id, estado: true }, clienteActualizado,
            { new: true }
        );

        if (!clienteActualizadoDB) {
            return res.status(404).json({ msg: "Cliente no encontrado o no activo" });
        }

        res.status(200).json({
            msg: "Los datos del cliente han sido actualizados por el administrador",
            cliente: clienteActualizadoDB
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Ocurrió un error inesperado"
        });
    }
};

export const deleteClienteAdmin = async (req, res) => {
    const { correo } = req.body;
    const token = global.tokenAcces;

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const admin1 = await Admin.findById(uid);

        if (!admin1) {
            return res.status(403).json({ msg: 'No tienes permisos para realizar esta acción' });
        }
        const rol = admin1.rol;

        if (rol !== 'ADMIN') {
            return res.status(403).json({
                msg: "No tienes permisos para realizar esta acción"
            });
        }

        const cliente = await Cliente.findOneAndUpdate({ correo: correo }, { estado: false });

        if (!cliente) {
            return res.status(404).json({
                msg: "Cliente no encontrado"
            });
        }

        res.status(200).json({
            msg: "Cliente eliminado correctamente"
        });
    } catch (e) {
        console.error(e);
        res.status(400).json({
            msg: "Ocurrió un error inesperado"
        });
    }
};