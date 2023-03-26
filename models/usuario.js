const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    require: true,
    unique: true,
  },
  contra: String,
  tipo: String,
});

module.exports = mongoose.model("Usuario", UsuarioSchema);
