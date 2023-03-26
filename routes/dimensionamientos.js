const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fs = require("fs-extra");
const path = require("path");
const mongoose = require("mongoose");
const upload = require("../libs/almacen");

const Dimensionamiento = mongoose.model("Dimensionamiento");

router.get("/", async (req, res) => {
  await Dimensionamiento.find((err, dim) => {
    if (err) {
      return res.send("No hay información");
    }
    res.send(dim);
  }).clone();
});

router.get("/datos/:codigo", async (req, res) => {
  let dim = await Dimensionamiento.findOne({ codigo: req.params.codigo });
  if (!dim) {
    return res.status(404).send("Dimensionamiento no encontrado");
  }
  res.send({ dim });
});

router.post("/", async (req, res) => {
  // Fecha de recepción formateada dd/mm/yyyy
  let ultimo = await Dimensionamiento.findOne().sort({ codigo: -1 });
  if (!ultimo) {
    codigo = 1;
  } else {
    codigo = parseInt(ultimo.codigo) + 1;
  }
  let dim_guardado = new Dimensionamiento({
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
      atencion: req.body.fecha.atencion,
    },
    hora: req.body.hora,
    reporte: req.body.reporte,
    descripcion: req.body.descripcion,
    servicios: req.body.servicios,
    material: req.body.material,
    dias: req.body.dias,
    horario: req.body.horario,
    personal: req.body.personal,
    notas: req.body.notas,
    estatus: req.body.estatus,
  });

  await dim_guardado.save();
  res.status(201).send({ dim_guardado });
});

router.put("/", async (req, res) => {
  let dim = await Dimensionamiento.findOne({ codigo: req.body.codigo });
  if (!dim) {
    return res.status(404).send("Dimensionamiento no encontrado");
  }

  let dim_modificado = await Dimensionamiento.findOneAndUpdate(
    { codigo: req.body.codigo },
    {
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
        atencion: req.body.fecha.atencion,
      },
      hora: req.body.hora,
      reporte: req.body.reporte,
      descripcion: req.body.descripcion,
      servicios: req.body.servicios,
      material: req.body.material,
      dias: req.body.dias,
      horario: req.body.horario,
      personal: req.body.personal,
      notas: req.body.notas,
      estatus: req.body.estatus,
    },
    { new: true }
  );

  res.send({ dim_modificado });
});

router.delete("/eliminar/:codigo", async (req, res) => {
  let dim = await Dimensionamiento.findOne({ codigo: req.params.codigo });
  if (!dim) {
    return res.status(404).send("Proveedor no encontrado");
  }

  let dim_eliminado = await Dimensionamiento.findOneAndDelete({
    codigo: req.params.codigo,
  });
  res.send({ dim_eliminado });
});

module.exports = router;