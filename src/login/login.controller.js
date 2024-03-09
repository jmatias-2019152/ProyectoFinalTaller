import Admin from '../administradores/administrador.model.js';
import Cliente from '../cliente/cliente.model.js';
import { generarJWT } from '../helpers/generate-jwt.js'
import bcryptjs from 'bcryptjs'

export const loginGet = async (req, res) => {
    const { correo, password } = req.body;
    const query = { estado: true };

    const [cliente, admin] = await Promise.all([
        Cliente.find({ ...query, correo }),
        Admin.find({ ...query, correo })
    ]);

    let user;
    let log;

    for (const element of cliente) {
        if (await bcryptjs.compare(password, element.password)) {
            user = element;
            log = 'Cliente';
            break;
        }
    }

    if (!user) {
        for (const element of admin) {
            if (await bcryptjs.compare(password, element.password)) {
                user = element;
                log = 'Admin';
                break;
            }
        }
    }

    if (user) {
        const token = await generarJWT(user._id);
        global.tokenAcces = token;

        return res.status(200).json({
            msg:
                `---------- Se inicio sesion como ${log} ----------
        ------------------- BIENVENIDO -------------------
        ------------------ Token Creado ------------------`
        });
    }

    return res.status(400).json({
        msg: 'Datos incorrectos'
    });
};

export const usuariosGet = async (req, res) => {

    const { limite, desde } = req.query;
    const query = { estado: true };

    const [totalAdmin, admin] = await Promise.all([
        Admin.countDocuments(query),
        Admin.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    const [totalCliente, clientes] = await Promise.all([
        Cliente.countDocuments(query),
        Cliente.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        totalAdmin,
        admin,
        totalCliente,
        clientes
    });
};