var express = require("express");
var router = express.Router();
const { body, validationResult } = require("express-validator");
const fs = require("fs-extra");
const path = require("path");
const mongoose = require("mongoose");
const upload = require("../libs/almacen");

const Empleado = mongoose.model("Empleado");

router.get("/", async (req, res) => {
  await Empleado.find((err, emp) => {
    if (err) {
      return res.send("No hay información");
    }
    res.send(emp);
  }).clone();
});



router.get("/datos/:emp", async (req, res) => {
  let emp = await Empleado.findOne({ codigo: req.params.emp });
  if (!emp) {
    return res.status(402).send("Empleado no encontrado");
  }
  res.send({ emp });
});

router.post("/", upload.single("imagen"), async (req, res) => {
  // Se le suma 1 al codigo del ultimo cliente
  let ultimo = await Empleado.findOne().sort({ codigo: -1 });
  // Si no hay registros se le asigna el codigo 1
  if (!ultimo) {
    codigo = 1;
  } else {
    codigo = parseInt(ultimo.codigo) + 1;
  }
  let emp_guardado = new Empleado({
    codigo: codigo,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    puesto: req.body.puesto,
    telefono: req.body.telefono,
    correo: req.body.correo,
    direccion: req.body.direccion,
    estatus: req.body.estatus,
  });

  if (req.file) {
    const { filename } = req.file;
    emp_guardado.setimgurl(filename);
  }

  await emp_guardado.save();
  res.status(201).send({ emp_guardado });
});

router.put("/", upload.single("imagen"), async (req, res) => {
  let emp = await Empleado.findOne({ codigo: req.body.codigo });
  if (!emp) {
    return res.status(402).send("Empleado no encontrado");
  }

  let urlfotoanterior;
  if (emp.imagen) {
    urlfotoanterior = emp.imagen.split("/");
  }

  if (req.file) {
    const { filename } = req.file;
    emp.setimgurl(filename);
  }

  const imagen_anterior = emp.imagen;

  let emp_modificado = await Empleado.findOneAndUpdate(
    //Lo que se va a buscar
    { codigo: req.body.codigo },
    //Lo que se va a modificar
    {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      telefono: req.body.telefono,
      correo: req.body.correo,
      direccion: req.body.direccion,
      puesto: req.body.puesto,
      estatus: req.body.estatus,
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

  res.send({ emp_modificado });
});

//Eliminar
router.delete("/eliminar/:codigo", async (req, res) => {
  let emp = await Empleado.findOne({ codigo: req.params.codigo });
  if (!emp) {
    return res.status(402).send("Empleado no encontrado");
  }

  let emp_eliminado = await Empleado.findOneAndDelete({
    codigo: req.params.codigo,
  });
  res.send({ emp_eliminado });
});

//Consultar un solo documento para iniciar sesión con token
router.get('/login/:emp', async (req, res) => {
  let empleado = await Empleado.findOne({ correo: req.params.emp })
  if (!empleado) {
    return res.status(402).send("Empleado no encontrado");
  }
  jwtoken = empleado.generadorJWT();

  emp = {
    "nombre": empleado.nombre,
    "apellido": empleado.apellido,
    "correo": empleado.correo,
    "puesto": empleado.puesto,
    "imagen": empleado.imagen,
    "estatus": empleado.estatus,
    "jwebtoken": jwtoken
  }
  res.send({ emp });
});
module.exports = router;