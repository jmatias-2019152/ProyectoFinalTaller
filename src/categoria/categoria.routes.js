import { Router } from "express";
import { categoriaDelete, categoriaGet, categoriaPost } from "./categoria.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { existeCategoria } from "../helpers/db-validators.js";
import { check } from "express-validator";

const router = Router();


router.get(
    '/get',
    [
        validarJWT
    ],
    categoriaGet
);

router.post(
    '/post',
    [
        validarJWT,
        check("nombreCategoria", "El nombre es obligatorio").custom(existeCategoria).not().isEmpty(),
        check("descripcion", "La descripcion es necesaria").not().isEmpty(),
        validarCampos
    ],
    categoriaPost
);

router.delete(
    '/delete',
    [
        validarJWT,
        check("nombreCategoria", "El nombre es obligatorio, Debe ser identico").not().isEmpty(),
        validarCampos
    ],
    categoriaDelete
);

export default router;