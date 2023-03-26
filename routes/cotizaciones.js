var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
//Libreria de mongoose para manipular los datos
const mongoose = require("mongoose");

//Referencia del Schema para usarlo en las rutas de apirest
const Cotizacion = mongoose.model("Cotizacion");

router.get("/", async (req, res) => {
  await Cotizacion.find((err, coti) => {
    if (err) {
      return res.send("No hay información");
    }
    res.send(coti);
  }).clone();
});

router.get("/datos/:codigo", async (req, res) => {
  let coti = await Cotizacion.findOne({ codigo: req.params.codigo });
  if (!coti) {
    return res.status(402).send("Cotizacion no encontrada");
  }
  res.send({ coti });
});

router.post("/", async (req, res) => {
  // Se le suma 1 al codigo del ultimo cliente
  let ultimo = await Cotizacion.findOne().sort({ codigo: -1 });
  // Si no hay registros se le asigna el codigo 1
  if (!ultimo) {
    codigo = 1;
  } else {
    codigo = parseInt(ultimo.codigo) + 1;
  }
  let coti_guardada = new Cotizacion({
    codigo: codigo,
    nombre: req.body.nombre,
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
      vigencia: req.body.fecha.vigencia,
    },
    pago: req.body.pago,
    servicios: req.body.servicios,
    productos: req.body.productos,
    total: req.body.total,
    notas: req.body.notas,
    estatus: req.body.estatus,
  });

  await coti_guardada.save();
  res.status(201).send({ coti_guardada });
});

router.put("/", async (req, res) => {
  let coti = await Cotizacion.findOne({ codigo: req.body.codigo });
  if (!coti) {
    return res.status(404).send("Cotización no encontrada");
  }

  let coti_modificado = await Cotizacion.findOneAndUpdate(
    { codigo: req.body.codigo },
    {
      codigo: req.body.codigo,
      nombre: req.body.nombre,
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
        vigencia: req.body.fecha.vigencia,
      },
      pago: req.body.pago,
      servicios: req.body.servicios,
      productos: req.body.productos,
      total: req.body.total,
      notas: req.body.notas,
      estatus: req.body.estatus,
    },
    { new: true }
  );
  res.status(201).send({ coti_modificado });
});

router.delete("/eliminar/:codigo", async (req, res) => {
  let coti = await Cotizacion.findOne({ codigo: req.params.codigo });
  if (!coti) {
    return res.status(404).send("Cotización no encontrada");
  }

  let coti_eliminada = await Cotizacion.findOneAndDelete({
    codigo: req.params.codigo,
  });
  res.send({ coti_eliminada });
});
module.exports = router;