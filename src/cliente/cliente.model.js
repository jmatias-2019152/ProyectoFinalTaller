import mongoose from 'mongoose';

const ClienteSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true
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
        default: 'CLIENT'
    },
    estado: {
        type: Boolean,
        default: true
    }

});

export default mongoose.model('Cliente', ClienteSchema)
