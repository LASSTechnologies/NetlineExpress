const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  codigo: {
    type: Number,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  noParte: {
    type: String,
    required: true,
  },
  proveedores: {
    type: [String],
    required: true,
  },

  categoria: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  unidad: {
    type: String,
    required: true,
  },
  precio: {
    type: String,
    required: true,
  },
  existencia: {
    type: String,
    required: true,
  },
  imagen: {
    type: String,
    required: false,
  },
});
productoSchema.methods.setimgurl = function setimgurl(imagen) {
  this.imagen = "http://localhost:3000/foto/" + imagen;
};

mongoose.model("Producto", productoSchema);