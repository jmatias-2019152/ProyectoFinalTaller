import { Router } from "express";
import { check } from "express-validator";
import { loginGet, usuariosGet } from "./login.controller.js";



const router = Router();

router.get(
    '/login',
    [
        
        check('correo', 'El correo es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
    ],
    loginGet
);

router.get(
    '/',
    usuariosGet
);

export default router;
