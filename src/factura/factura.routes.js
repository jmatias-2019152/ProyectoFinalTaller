import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js"
import {  generarFactura } from "./factura.controller.js";


const router = Router();

router.post(
    '/post',
    [
        validarJWT
    ],
    generarFactura
);

export default router;