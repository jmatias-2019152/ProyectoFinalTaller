import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true
    },
    usuario:{
        type: String,
        required: true,
        unique: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true,
        default: 'ADMIN'
    },
    estado: {
        type: Boolean,
        default: true
    }

});

export default mongoose.model('Admin', AdminSchema);