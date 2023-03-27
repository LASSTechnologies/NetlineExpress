var express = require("express");
var router = express.Router();
const { body, validationResult } = require("express-validator");
const fs = require("fs-extra");
const path = require("path");
const mongoose = require("mongoose");
const upload = require("../libs/almacen");

const Acceso = mongoose.model("Acceso");

router.get("/", async (req, res) => {
  await Acceso.find((err, acc) => {
    if (err) {
      return res.send("No hay información");
    }
    res.send(acc);
  }).clone();
});

router.get("/datos/:emp", async (req, res) => {
  let emp = await Empleado.findOne({ codigo: req.params.emp });
  if (!emp) {
    return res.status(402).send("Empleado no encontrado");
  }
  res.send({ emp });
});

router.delete("/", async (req, res) => {
  try {
    const result = await Acceso.deleteMany();
    res.json({ message: `Se eliminaron los registros` });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
});
router.post("/", async (req, res) => {
  // Se le suma 1 al codigo del ultimo cliente
  let ultimo = await Acceso.findOne().sort({ codigo: -1 });
  // Si no hay registros se le asigna el codigo 1
  if (!ultimo) {
    codigo = 1;
  } else {
    codigo = parseInt(ultimo.codigo) + 1;
  }

  const nDate = new Date().toLocaleString("en-US", {
    timeZone: "America/Mexico_City",
  });
  let hora = nDate.split(", ")[1];
  const fecha = new Date(nDate).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  console.log(hora);
  console.log(fecha);

  mensaje = req.body.data.split(",");
  accion = mensaje[0];
  lugar = mensaje[1];

  let evento = new Acceso({
    codigo: codigo,
    fecha: fecha,
    hora: hora,
    accion: accion,
    lugar: lugar,
  });

  await evento.save();
  res.status(201).send({ evento });
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
router.get("/login/:emp", async (req, res) => {
  let empleado = await Empleado.findOne({ correo: req.params.emp });
  if (!empleado) {
    return res.status(402).send("Empleado no encontrado");
  }
  jwtoken = empleado.generadorJWT();

  emp = {
    nombre: empleado.nombre,
    apellido: empleado.apellido,
    correo: empleado.correo,
    puesto: empleado.puesto,
    imagen: empleado.imagen,
    estatus: empleado.estatus,
    jwebtoken: jwtoken,
  };
  res.send({ emp });
});
module.exports = router;
