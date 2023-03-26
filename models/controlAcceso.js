const mongoose = require("mongoose");

const accesoSchema = new mongoose.Schema({
    codigo: {
        type: Number,
        unique: true,
    },
    fecha: {
        type: String,
        required: true,
    },
    hora: {
        type: String,
        required: true,
    },
    accion: {
        type: String,
        required: true,
    },
    lugar: {
        type: String,
        required: true,
    }
});


mongoose.model("Acceso", accesoSchema);
