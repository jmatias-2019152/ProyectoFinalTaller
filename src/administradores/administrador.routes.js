import { Router } from "express";
import { check } from "express-validator";
import { adminPost } from "./administrador.controller.js";
import { existeEmail } from "../helpers/db-validators.js"
import { validarCampos } from "../middlewares/validar-campos.js";
import Admin from "./administrador.model.js";


const router = Router();


router.post(
    '/post',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('usuario', 'El usuario es obligatorio').not().isEmpty(),
        check('correo', 'correo no colocado o este correo ya existe').custom((value) => existeEmail(value, Admin)).not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    adminPost
);



export default router;