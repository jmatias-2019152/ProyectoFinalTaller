import mongoose, { Schema }  from "mongoose";

const productSchema = mongoose.Schema({
    nombre: {
        type: String, 
        required: true,
        unique: true
    },
    precio: {
        type: Number,
        required: true
    }, 
    descripcion: {
        type: String, 
        required: true
    },
    stock: {
        type: Number, 
        required: true,
    },
    vendidos: {
        type: Number,
        required: false, 
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "Categoria",
        required: true
    }
},{
    versionKey: false  
})

export default mongoose.model('Producto', productSchema)