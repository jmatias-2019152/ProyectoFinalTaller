import Cliente from "./cliente.model.js";
import bcrypt from "bcryptjs"


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
    const { correo, nombre, password } = req.body;
    try {
        const cliente = await Cliente.findOne({ correo });
        console.log(cliente.correo)
        const salt = bcrypt.genSaltSync();
        const contraseñaIncritada = bcrypt.hashSync(password, salt);



        const clienteact = await Cliente.findOneAndUpdate({ correo, estado: true }, { nombre, password : contraseñaIncritada }, { new: true });
        console.log(clienteact.password)
        if (!clienteact) {
            return res.status(404).json({ msg: "Cliente no encontrado o no activo" });
        }
       
        res.status(200).json({
            msg: "Los datos han sido actualizados",
            empresa: clienteact
        });
    } catch (error) {
        console.error('Error al actualizar la empresa:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};
