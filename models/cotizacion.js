const mongoose = require("mongoose");

const cotizacionSchema = new mongoose.Schema({
  codigo: {
    type: Number,
    unique: true,
  },
  nombre: String,
  cliente: {
    empresa: String,
    nombre: String,
    telefono: String,
    correo: String,
    direccion: String,
  },
  empleado: {
    recibe: String,
    participa: [String],
  },
  fecha: {
    recepcion: String,
    vigencia: String,
  },
  pago: String,
  servicios: [
    {
      cantidad: Number,
      imagen: String,
      descripcion: String,
      precio: Number,
      subtotal: Number,
    },
  ],
  productos: [
    {
      cantidad: Number,
      garantia: String,
      entrega: String,
      imagen: String,
      descripcion: String,
      precio: Number,
      utilidad: Number,
      importe: Number,
      subtotal: Number,
      proveedor: String,
    },
  ],
  total: Number,
  notas: String,
  estatus: String,
});

mongoose.model("Cotizacion", cotizacionSchema);