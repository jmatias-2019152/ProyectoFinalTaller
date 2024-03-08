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
