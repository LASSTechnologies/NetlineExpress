const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fs = require("fs-extra");
const path = require("path");
const mongoose = require("mongoose");
const upload = require("../libs/almacen");

const Producto = mongoose.model("Producto");

router.get("/", async (req, res) => {
  await Producto.find((err, prod) => {
    if (err) {
      return res.send("No hay información");
    }
    res.send(prod);
  }).clone();
});

router.get("/datos/:prod", async (req, res) => {
  let prod = await Producto.findOne({ codigo: req.params.prod });
  if (!prod) {
    return res.status(402).send("Producto no encontrado");
  }
  res.send({ prod });
});

router.post("/", upload.single("imagen"), async (req, res) => {
  let ultimo = await Producto.findOne().sort({ codigo: -1 });
  if (!ultimo) {
    codigo = 1;
  } else {
    codigo = parseInt(ultimo.codigo) + 1;
  }
  let prod_guardado = new Producto({
    codigo: codigo,
    nombre: req.body.nombre,
    noParte: req.body.noParte,
    proveedores: req.body.proveedores,
    tipo: req.body.tipo,
    categoria: req.body.categoria,
    descripcion: req.body.descripcion,
    unidad: req.body.unidad,
    precio: req.body.precio,
    existencia: req.body.existencia,
  });

  if (req.file) {
    const { filename } = req.file;
    prod_guardado.setimgurl(filename);
  }

  await prod_guardado.save();
  res.status(201).send({ prod_guardado });
});

router.put("/", upload.single("imagen"), async (req, res) => {
  let prod = await Producto.findOne({ codigo: req.body.codigo });
  if (!prod) {
    return res.status(402).send("Producto no encontrado");
  }

  let urlfotoanterior;
  if (prod.imagen) {
    urlfotoanterior = prod.imagen.split("/");
  }

  if (req.file) {
    const { filename } = req.file;
    prod.setimgurl(filename);
  }

  const imagen_anterior = prod.imagen;

  let prod_modificado = await Producto.findOneAndUpdate(
    //Lo que se va a buscar
    { codigo: req.body.codigo },
    //Lo que se va a modificar
    {
      nombre: req.body.nombre,
      noParte: req.body.noParte,
      proveedores: req.body.proveedores,
      tipo: req.body.tipo,
      categoria: req.body.categoria,
      descripcion: req.body.descripcion,
      unidad: req.body.unidad,
      precio: req.body.precio,
      existencia: req.body.existencia,
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

  res.send({ prod_modificado });
});

router.delete("/eliminar/:prod", async (req, res) => {
  let prod = await Producto.findOne({ codigo: req.params.prod });
  if (!prod) {
    return res.status(402).send("Producto no encontrado");
  }

  let prod_eliminado = await Producto.findOneAndDelete({ id: req.params.prod });
  res.send({ prod_eliminado });
});

module.exports = router;