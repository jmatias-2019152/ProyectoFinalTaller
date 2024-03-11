import Factura from './factura.model.js'
import Carrito from '../carrito/carrito.model.js'
import Cliente from '../cliente/cliente.model.js'
import PDFDocument from 'pdfkit';
import jwt from 'jsonwebtoken';

export const generarFactura = async (req, res) => {
    const token = global.tokenAcces;
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const cliente = await Cliente.findById(uid);

        let carrito = await Carrito.findOne({ cliente })
        if (!carrito) return res.status(404).send({ message: 'No existe el carrito' });

        const deCarritoAFactura = carrito.productos.map(cosasDelCarrito => {
            return {
                producto: cosasDelCarrito.producto,
                cantidad: cosasDelCarrito.cantidad,
                subtotal: cosasDelCarrito.subtotal
            };
        });


        let total = 0;
        deCarritoAFactura.forEach(cartItem => {
            total += cartItem.subtotal;
        });

        const factura = new Factura({
            fecha: new Date(),
            cliente: cliente,
            productos: deCarritoAFactura,
            total: total,
            nit: 'CF'
        });

        await factura.save();

        const pdfDoc = new PDFDocument();

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=Factura_${cliente.nombre}.pdf`,
        });

        pdfDoc.pipe(res);
        pdfDoc.text('Factura', { align: 'center', underline: true });
        pdfDoc.text(`Fecha: ${factura.fecha}`);
        pdfDoc.text(`Cliente: ${cliente.nombre}`);
        pdfDoc.text(`NIT: ${factura.nit}`);
        pdfDoc.text('Productos:');

        deCarritoAFactura.forEach((cartItem, index) => {
            pdfDoc.text(`${index + 1}. - IdProducto:  ${cartItem.producto} - Cantidad: ${cartItem.cantidad} - Subtotal: ${cartItem.subtotal}`, { align: 'center' });
        });

        pdfDoc.text(`Total: ${total}`, { align: 'right' });

        pdfDoc.end();

        await Carrito.findOneAndDelete({ cliente: cliente });
    } catch (error) {
        console.error('Error al crear la factura:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};