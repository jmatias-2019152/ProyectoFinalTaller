import mongoose from "mongoose";

const CategoriaSchema = mongoose.Schema({
    nombreCategoria:{
        type: String, 
        required: true,
        unique: true
    },
    descripcion: {
        type: String, 
        required: true
    }
},{
    versionKey: false
})

export default mongoose.model('Categoria', CategoriaSchema)