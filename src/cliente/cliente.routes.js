import { Router } from "express";
import { check } from "express-validator";
import { clientePost, clientePut } from "./cliente.controller.js";
import { existeEmail } from "../helpers/db-validators.js"
import { validarCampos } from "../middlewares/validar-campos.js";
import Cliente from './cliente.model.js'
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();


router.post(
    '/post',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('correo', 'correo no colocado o este correo ya existe').custom((value) => existeEmail(value, Cliente)).not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    clientePost
);


router.put(
    '/put',
    [
        validarJWT,
        check('correo', 'Se necesita el correo para poder editar').not().isEmpty(),
        validarCampos,
    ],
    clientePut
);



export default router;