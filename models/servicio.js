const mongoose = require("mongoose");

const servicioSchema = new mongoose.Schema({
  codigo: {
    type: Number,
    unique: true,
  },
  nombre: {
    type: String,
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

  imagen: {
    type: String,
    required: false,
  },
});
servicioSchema.methods.setimgurl = function setimgurl(imagen) {
  this.imagen = "http://localhost:3000/foto/" + imagen;
};

mongoose.model("Servicio", servicioSchema);