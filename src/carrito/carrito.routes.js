import { Router } from "express";
import { check } from "express-validator";
import { carritoGet, carritoPost, carritoPut } from "./carrito.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js"


const router = Router();

router.get(
    '/get',
    [
        validarJWT
    ],
    carritoGet
);

router.post(
    '/post',
    [
        validarJWT,
        check('correo', 'El correo del cliente es necesario').not().isEmpty(),
        check('idProducto', 'El id del producto es necesario').not().isEmpty(),
        check('cantidad', 'La cantidad es obligatoria').not().isEmpty(),
        validarCampos,
    ],
    carritoPost
);

router.put(
    '/put',
    [   
        validarJWT,
        check('idProducto', 'El id del producto es necesario').not().isEmpty(),
        check('nuevaCantidad', 'La cantidad es obligatoria').not().isEmpty(),
    ],
    carritoPut
);

export default router;