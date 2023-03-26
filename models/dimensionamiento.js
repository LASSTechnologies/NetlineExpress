const mongoose = require("mongoose");

const dimensionamientoSchema = new mongoose.Schema({
  codigo: {
    type: Number,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
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
      required: true,
    },
  },
  fecha: {
    recepcion: {
      type: String,
    },
    atencion: {
      type: String,
      required: true,
    },
  },
  hora: {
    type: String,
    required: true,
  },
  reporte: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
  },
  servicios: {
    type: [
      {
        nombre: {
          type: String,
        },
        categoria: {
          type: String,
        },
        descripcion: {
          type: String,
        },
      },
    ],
  },
  material: {
    type: [
      {
        nombre: {
          type: String,
          required: true,
        },
        noParte: {
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
        cantidad: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  dias: {
    type: String,
  },
  horario: {
    type: String,
  },
  personal: {
    type: String,
  },
  notas: {
    type: String,
  },
  estatus: {
    type: String,
    required: true,
  },
});

mongoose.model("Dimensionamiento", dimensionamientoSchema);