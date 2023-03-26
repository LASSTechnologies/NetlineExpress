const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fs = require("fs-extra");
const path = require("path");
const mongoose = require("mongoose");
const upload = require("../libs/almacen");

const Servicio = mongoose.model("Servicio");

router.get("/", async (req, res) => {
  await Servicio.find((err, Serv) => {
    if (err) {
      return res.send("No hay información");
    }
    res.send(Serv);
  }).clone();
});

router.get("/datos/:codigo", async (req, res) => {
  let serv = await Servicio.findOne({ codigo: req.params.codigo });
  if (!serv) {
    return res.status(402).send("Servicio no encontrado");
  }
  res.send({ serv });
});

router.post("/", upload.single("imagen"), async (req, res) => {
  let ultimo = await Servicio.findOne().sort({ codigo: -1 });
  if (!ultimo) {
    codigo = 1;
  } else {
    codigo = parseInt(ultimo.codigo) + 1;
  }
  let Serv_guardado = new Servicio({
    codigo: codigo,
    nombre: req.body.nombre,
    categoria: req.body.categoria,
    descripcion: req.body.descripcion,
    unidad: "MO",
    precio: req.body.precio,
  });

  if (req.file) {
    const { filename } = req.file;
    Serv_guardado.setimgurl(filename);
  }

  await Serv_guardado.save();
  res.status(201).send({ Serv_guardado });
});

router.put("/", upload.single("imagen"), async (req, res) => {
  let Serv = await Servicio.findOne({ codigo: req.body.codigo });
  if (!Serv) {
    return res.status(402).send("Servicio no encontrado");
  }

  let urlfotoanterior;
  if (Serv.imagen) {
    urlfotoanterior = Serv.imagen.split("/");
  }

  if (req.file) {
    const { filename } = req.file;
    Serv.setimgurl(filename);
  }

  const imagen_anterior = Serv.imagen;

  let Serv_modificado = await Servicio.findOneAndUpdate(
    //Lo que se va a buscar
    { codigo: req.body.codigo },
    //Lo que se va a modificar
    {
      nombre: req.body.nombre,
      categoria: req.body.categoria,
      descripcion: req.body.descripcion,
      unidad: "MO",
      precio: req.body.precio,
      imagen: imagen_anterior,
    },
    //Lo que se va a retornar, true = Objeto modificado || false = Objeto antes de modificar
    {
      new: true,
    }
  );

  if (req.file && urlfotoanterior) {
    await fs.unlink(path.resolve("almacen/img/" + urlfotoanterior[4]));
  }

  res.send({ Serv_modificado });
});

router.delete("/eliminar/:codigo", async (req, res) => {
  let serv = await Servicio.findOne({ codigo: req.params.codigo });
  if (!serv) {
    return res.status(402).send("Servicio no encontrado");
  }

  let Serv_eliminado = await Servicio.findOneAndDelete({
    codigo: req.params.codigo,
  });
  res.send({ Serv_eliminado });
});

module.exports = router;