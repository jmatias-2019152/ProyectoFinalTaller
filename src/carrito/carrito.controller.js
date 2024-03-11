import Carrito from './carrito.model.js';
import Cliente from '../cliente/cliente.model.js';
import Producto from '../producto/producto.model.js';
import jwt  from "jsonwebtoken";

export const carritoGet = async (req, res) => {
    const token = global.tokenAcces;

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const cliente = await Cliente.findById(uid);

        console.log(cliente.correo)

        if (!cliente) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        const carrito = await Carrito.findOne({ cliente })

        if (!carrito) {
            return res.status(404).send({ message: 'Carrito no encontrado para este usuario' });
        }

        return res.send({ message: 'Carrito mostrado exitosamente', carrito });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

export const carritoPost = async (req, res) => {
    let { correo, idProducto, cantidad } = req.body;
    
    try {
        cantidad = parseInt(cantidad, 10);

        const cliente = await Cliente.findOne({ correo });

        if (!cliente) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        const producto = await Producto.findById(idProducto);

        if (!producto) {
            return res.status(404).send({ message: 'Producto no encontrado' });
        }

        let uniqueCart = await Carrito.findOne({ cliente });

        if (!uniqueCart) {
            if (producto.stock < cantidad) {
                return res.status(400).send({ message: `Solo hay: ${producto.stock}` });
            }

            uniqueCart = new Carrito({
                cliente,
                productos: [{
                    producto: idProducto,
                    cantidad,
                    subtotal: producto.precio * cantidad,
                }],
            });
        } else {
            const productExists = uniqueCart.productos.find(item => item.producto.toString() === idProducto);

            if (productExists) {
                const limiteStock = productExists.cantidad + cantidad;

                if (producto.stock >= limiteStock) {
                    productExists.cantidad += cantidad;
                    const subtotal = producto.precio * cantidad;
                    productExists.subtotal += subtotal;
                } else {
                    return res.status(400).send({ message: `Solo hay: ${producto.stock}` });
                }
            } else {
                uniqueCart.productos.push({
                    producto: idProducto,
                    cantidad,
                    subtotal: producto.precio * cantidad,
                });
            }
        }

        const carrito = await uniqueCart.save();

        return res.send({ message: 'Producto y carrito guardados exitosamente', carrito });
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

export const carritoPut  = async (req, res) => {
    let { idProducto, nuevaCantidad } = req.body;
    const token = global.tokenAcces;
    
    try {
        nuevaCantidad = parseInt(nuevaCantidad, 10);

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const cliente = await Cliente.findById(uid);

        if (!cliente) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        let uniqueCart = await Carrito.findOne({ cliente });

        if (!uniqueCart) {
            return res.status(404).send({ message: 'Carrito no encontrado para este usuario' });
        }

        const productIndex = uniqueCart.productos.findIndex(item => item.producto.toString() === idProducto);

        if (productIndex !== -1) {
            const producto = await Producto.findById(idProducto);

            if (!producto) {
                return res.status(404).send({ message: 'Producto no encontrado' });
            }

            const cantidadAnterior = uniqueCart.productos[productIndex].cantidad;
            const subtotalAnterior = uniqueCart.productos[productIndex].subtotal;

            if (nuevaCantidad === 0) {
                uniqueCart.productos.splice(productIndex, 1);
            } else {
                uniqueCart.productos[productIndex].cantidad = nuevaCantidad;
                uniqueCart.productos[productIndex].subtotal = producto.precio * nuevaCantidad;
            }

            const carrito = await uniqueCart.save();

            return res.send({
                message: `Producto ${idProducto} en el carrito actualizado exitosamente`,
                carrito,
                cambios: {
                    cantidadAnterior,
                    nuevaCantidad,
                    subtotalAnterior,
                    nuevoSubtotal: producto.precio * nuevaCantidad,
                },
            });
        } else {
            return res.status(404).send({ message: 'Producto no encontrado en el carrito' });
        }
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    } 
}; 