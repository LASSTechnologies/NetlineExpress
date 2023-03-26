var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
//Libreria de mongoose para manipular los datos
const mongoose = require("mongoose");

//Referencia del Schema para usarlo en las rutas de apirest
const OrdenServicio = mongoose.model("OrdenServicio");

router.get("/", async (req, res) => {
  await OrdenServicio.find((err, ordenes) => {
    if (err) {
      return res.send("No hay información");
    }
    res.send(ordenes);
  }).clone();
});

router.get("/datos/:codigo", async (req, res) => {
  let orden = await OrdenServicio.findOne({ codigo: req.params.codigo });
  if (!orden) {
    return res.status(402).send("Orden de servicio no encontrada");
  }
  res.send({ orden });
});

router.post("/", async (req, res) => {
  let ultimo = await OrdenServicio.findOne().sort({ codigo: -1 });
  if (!ultimo) {
    codigo = 1;
  } else {
    codigo = parseInt(ultimo.codigo) + 1;
  }
  let orden_guardada = new OrdenServicio({
    codigo: codigo,
    cliente: {
      empresa: req.body.cliente.empresa,
      nombre: req.body.cliente.nombre,
      telefono: req.body.cliente.telefono,
      correo: req.body.cliente.correo,
      direccion: req.body.cliente.direccion,
    },
    empleado: {
      recibe: req.body.empleado.recibe,
      participa: req.body.empleado.participa,
    },
    fecha: {
      recepcion: req.body.fecha.recepcion,
      atencion: req.body.fecha.atencion,
    },
    horario: {
      inicio: req.body.horario.inicio,
      fin: req.body.horario.fin,
    },
    reporte: req.body.reporte,
    trabajo: req.body.trabajo,
    material: req.body.material,
    notas: req.body.notas,
    estatus: req.body.estatus,
  });

  await orden_guardada.save();
  res.status(201).send({ orden_guardada });
});

router.put("/", async (req, res) => {
  let orden = await OrdenServicio.findOne({ codigo: req.body.codigo });
  if (!orden) {
    return res.status(402).send("Orden de servicio no encontrada");
  }

  let orden_modificada = await OrdenServicio.findOneAndUpdate(
    //Lo que se va a buscar
    { codigo: req.body.codigo },
    //Lo que se va a modificar
    {
      cliente: {
        empresa: req.body.cliente.empresa,
        nombre: req.body.cliente.nombre,
        telefono: req.body.cliente.telefono,
        correo: req.body.cliente.correo,
        direccion: req.body.cliente.direccion,
      },
      empleado: {
        recibe: req.body.empleado.recibe,
        participa: req.body.empleado.participa,
      },
      fecha: {
        recepcion: req.body.fecha.recepcion,
        atencion: req.body.fecha.atencion,
      },
      horario: {
        inicio: req.body.horario.inicio,
        fin: req.body.horario.fin,
      },
      reporte: req.body.reporte,
      trabajo: req.body.trabajo,
      material: req.body.material,
      notas: req.body.notas,
      estatus: req.body.estatus,
    },
    //Lo que se va a retornar, true = Objeto modificado || false = Objeto antes de modificar
    {
      new: true,
    }
  );

  res.send({ orden_modificada });
});

//Eliminar
router.delete("/eliminar/:codigo", async (req, res) => {
  let orden = await OrdenServicio.findOne({ codigo: req.params.codigo });
  if (!orden) {
    return res.status(404).send("Orden no encontrado");
  }

  let orden_eliminado = await OrdenServicio.findOneAndDelete({
    codigo: req.params.codigo,
  });
  res.send({ orden_eliminado });
});

module.exports = router;