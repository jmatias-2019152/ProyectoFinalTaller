import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { check } from "express-validator";
import { productoGetByNombre, productoGet, productoGetById, productoPost, productoPut, productoGetPorCategoria, productoDelete } from "./producto.controller.js";
import { existeProducto } from "../helpers/db-validators.js"

const router = Router();


router.get(
    '/get',
    [
        validarJWT
    ],
    productoGet
);

router.get(
    '/buscarPorNombre',
    [
        validarJWT,
        check("nombre", "El nombre es obligatorio para poder buscar el producto, nombre tiene que ser identico").not().isEmpty(),
        validarCampos
    ],
    productoGetByNombre
);

router.get(
    '/buscarPorId',
    [
        validarJWT,
        check("id", "Colocar el id del producto que quiere buscar").not().isEmpty(),
        validarCampos
    ],
    productoGetById
);

router.get(
    '/buscarPorCategoria',
    [
        validarJWT,
        check("idCategoria", "Colocar el id de la categoria que quiere buscar").not().isEmpty(),
        validarCampos
    ],
    productoGetPorCategoria
);


router.post(
    '/post',
    [
        validarJWT,
        check("nombre", "El nombre es obligatorio").custom(existeProducto).not().isEmpty(),
        check("precio", "El precio es necesario").not().isEmpty(),
        check("descripcion", "La descripcion es necesaria").not().isEmpty(),
        check("stock", "La cantidad es necesaria").not().isEmpty(),
        check("categoria", "Necesitamos el id de la categoria").not().isEmpty(),
        validarCampos
    ],
    productoPost
);

router.put(
    '/put',

    [
        validarJWT,
        check("id", "Necesitamos el id para poder editar el producto").not().isEmpty(),
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("precio", "El precio es necesario").not().isEmpty(),
        check("descripcion", "La descripcion es necesaria").not().isEmpty(),
        check("stock", "La cantidad es necesaria").not().isEmpty(),
        check("categoria", "Necesitamos el id de la categoria").not().isEmpty(),
        validarCampos
    ],
    productoPut
);

router.delete(
    '/delete',
    [
        validarJWT,
        check("id", "Colocar el id del producto que quiere eliminar").not().isEmpty(),
        validarCampos
    ],
    productoDelete
);

export default router;