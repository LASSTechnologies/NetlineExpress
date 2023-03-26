const mongoose = require("mongoose");

const proveedorSchema = new mongoose.Schema({
  codigo: {
    type: Number,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  telefono: {
    type: [String],
    required: false,
  },
  correo: {
    type: [String],
    required: false,
  },
});

mongoose.model("Proveedor", proveedorSchema);