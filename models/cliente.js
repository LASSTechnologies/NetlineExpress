const mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema({
  codigo: {
    type: Number,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    required: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  rfc: {
    type: String,
    required: true,
  },
  responsable: {
    nombre: {
      type: String,
      required: true,
    },
    apellido: {
      type: String,
      required: true,
    },
    telefono: {
      type: String,
      required: true,
    },
    correo: {
      type: String,
      required: true,
    },
  },
  horario: {
    inicio: {
      type: String,
      required: true,
    },
    fin: {
      type: String,
      required: true,
    },
  },
  imagen: {
    type: String,
    required: false,
  },
  estatus: {
    type: String,
    required: true,
  },
});

clienteSchema.methods.setimgurl = function setimgurl(imagen) {
  this.imagen = "http://localhost:3000/foto/" + imagen;
};

mongoose.model("Cliente", clienteSchema);