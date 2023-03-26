const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

const empleadoSchema = new mongoose.Schema({
  codigo: {
    type: Number,
    unique: true,
  },
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
  direccion: {
    type: String,
    required: true,
  },
  puesto: {
    type: String,
    required: true,
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

empleadoSchema.methods.generadorJWT = function () {
  return jwt.sign({
    codigo: this.codigo,
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
  }, 'c=ntr4s3n14');
}

empleadoSchema.methods.setimgurl = function setimgurl(imagen) {
  this.imagen = "http://localhost:3000/foto/" + imagen;
};

mongoose.model("Empleado", empleadoSchema);