const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fs = require("fs-extra");
const path = require("path");

//Libreria de mongoose para manipular los datos
const mongoose = require("mongoose");
const upload = require("../libs/almacen");

//Referencia del Schema para usarlo en las rutas de apirest
const Proveedor = mongoose.model("Proveedor");

router.get("/", async (req, res) => {
  await Proveedor.find((err, provs) => {
    if (err) {
      return res.send("No hay información");
    }
    res.send(provs);
  }).clone();
});

router.get("/datos/:prov", async (req, res) => {
  let prov = await Proveedor.findOne({ codigo: req.params.prov });
  if (!prov) {
    return res.status(404).send("Proveedor no encontrado");
  }
  res.send({ prov });
});

router.post("/", async (req, res) => {
  let ultimo = await Proveedor.findOne().sort({ codigo: -1 });
  if (!ultimo) {
    codigo = 1;
  } else {
    codigo = parseInt(ultimo.codigo) + 1;
  }
  let prov_guardado = new Proveedor({
    codigo: codigo,
    nombre: req.body.nombre,
    direccion: req.body.direccion,
    telefono: req.body.telefono.toString().split(","),
    correo: req.body.correo.toString().split(","),
  });

  await prov_guardado.save();
  res.status(201).send({ prov_guardado });
});

router.put("/", async (req, res) => {
  let prov = await Proveedor.findOne({ codigo: req.body.codigo });
  if (!prov) {
    return res.status(404).send("Proveedor no encontrado");
  }

  let prov_modificado = await Proveedor.findOneAndUpdate(
    //Lo que se va a buscar
    { codigo: req.body.codigo },
    //Lo que se va a modificar
    {
      nombre: req.body.nombre,
      direccion: req.body.direccion,
      telefono: req.body.telefono.toString().split(","),
      correo: req.body.correo.toString().split(","),
    },
    //Lo que se va a retornar, true = Objeto modificado || false = Objeto antes de modificar
    {
      new: true,
    }
  );

  res.send({ prov_modificado });
});

//Eliminar
router.delete("/eliminar/:codigo", async (req, res) => {
  let prov = await Proveedor.findOne({ codigo: req.params.codigo });
  if (!prov) {
    return res.status(404).send("Proveedor no encontrado");
  }

  let prov_eliminado = await Proveedor.findOneAndDelete({
    codigo: req.params.codigo,
  });
  res.send({ prov_eliminado });
});

module.exports = router;