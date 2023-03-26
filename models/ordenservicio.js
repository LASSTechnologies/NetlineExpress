const mongoose = require("mongoose");

const ordenServicioSchema = new mongoose.Schema({
  codigo: {
    type: Number,
    unique: true,
  },
  cliente: {
    empresa: {
      type: String,
      required: true,
    },
    nombre: {
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
  },
  empleado: {
    recibe: {
      type: String,
    },
    participa: {
      type: [String],
    },
  },
  fecha: {
    recepcion: {
      type: String,
      required: true,
    },
    atencion: {
      type: String,
    },
  },
  horario: {
    inicio: {
      type: String,
    },
    fin: {
      type: String,
    },
  },
  reporte: {
    type: String,
  },
  trabajo: {
    type: String,
  },
  material: {
    type: [
      {
        nombre: {
          type: String,
        },
        noParte: {
          type: String,
        },
        descripcion: {
          type: String,
        },
        unidad: {
          type: String,
        },
        cantidad: {
          type: String,
        },
      },
    ],
  },
  notas: {
    type: String,
  },
  estatus: {
    type: String,
  },
});

mongoose.model("OrdenServicio", ordenServicioSchema);