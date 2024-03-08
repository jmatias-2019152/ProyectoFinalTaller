import Admin from "./administrador.model.js";
import bcrypt from "bcryptjs"
 

export const adminPost = async (req, res) => {
    const { nombre, usuario, correo, password } = req.body;
    const admin = new Admin({ nombre, usuario, correo, password });

    const salt = bcrypt.genSaltSync();
    admin.password = bcrypt.hashSync(password, salt);
    
    await admin.save();

    res.status(200).json({
        admin,
    });
};
