import Admin from "./administrador.model.js";
import { generarJWT } from "../helpers/generate-jwt.js"
import bcrypt from "bcryptjs"
 

export const register = async (req, res) => {
    const { name, correo, password } = req.body;
    const admin = new Admin({ name, correo, password });

    const salt = bcrypt.genSaltSync();
    admin.password = bcrypt.hashSync(password, salt);
    
    await admin.save();

    res.status(200).json({
        admin,
    });
}