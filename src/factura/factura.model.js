import mongoose, { Schema } from 'mongoose'


const FacturaSchema = mongoose.Schema({
    fecha: {
        type: Date,
        required: true
    },
    nit: {
        type: String,
        required: true,
        default: 'CF'
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    productos: [{
        producto: {
            type: Schema.Types.ObjectId,
            ref: 'Producto',
            required: true
        },
        cantidad: {
            type: Number,
            required: true,
            default: 0
        },
        subtotal: {
            type: Number,
            required: true,
            default: 0
        }
    }],
    total: {
        type: Number,
        required: true,
        default: 0
    },

},{
    versionKey: false
})

export default mongoose.model('Factura', FacturaSchema);