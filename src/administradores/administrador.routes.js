import { Router } from "express";
import { check } from "express-validator";
import { activarCliente, adminPost, deleteClienteAdmin, putClienteAdmin } from "./administrador.controller.js";
import { existeEmail, existeUsuario } from "../helpers/db-validators.js"
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js"
import Admin from "./administrador.model.js";


const router = Router();


router.post(
    '/post',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('usuario', 'El usuario es obligatorio').not().isEmpty().custom(existeUsuario),
        check('correo', 'correo no colocado o este correo ya existe').custom((value) => existeEmail(value, Admin)).not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    adminPost
);

router.put(
    '/activar',
    [
        validarJWT,
        check('correo', 'Se necesita el correo para poder reactivar la cuenta').not().isEmpty(),
        validarCampos,
    ],
    activarCliente
);

router.put(
    '/putCliente',
    [
        validarJWT,
        check('correo', 'Se necesita el correo para poder editar').not().isEmpty(),
        validarCampos,
    ],
    putClienteAdmin
);

router.delete(
    '/deleteCliente',
    [

        validarJWT,
        check('correo', 'Se necesita el correo para poder eliminar la cuenta').not().isEmpty(),
        validarCampos,

    ],
    deleteClienteAdmin
);

export default router;