import mongoose, { Schema } from 'mongoose'

const CarritoSchema = mongoose.Schema({
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true          
    },
    productos: [{
        producto: {
            type: Schema.Types.ObjectId,
            ref: 'product',
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
    }]
},{
    versionKey: false
}) 

export default mongoose.model('Carrito', CarritoSchema)