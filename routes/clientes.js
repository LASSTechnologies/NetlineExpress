var express = require("express");
var router = express.Router();
const { body, validationResult } = require("express-validator");
const fs = require("fs-extra");
const path = require("path");
//Libreria de mongoose para manipular los datos
const mongoose = require("mongoose");
const upload = require("../libs/almacen");

//Referencia del Schema para usarlo en las rutas de apirest
const Cliente = mongoose.model("Cliente");

router.get("/", async (req, res) => {
  await Cliente.find((err, cli) => {
    if (err) {
      return res.send("No hay información");
    }
    res.send(cli);
  }).clone();
});

router.get("/datos/:cli", async (req, res) => {
  let cli = await Cliente.findOne({ codigo: req.params.cli });
  if (!cli) {
    return res.status(402).send("Cliente no encontrado");
  }
  res.send({ cli });
});

router.post("/", upload.single("imagen"), async (req, res) => {
  // Se le suma 1 al codigo del ultimo cliente
  let ultimo = await Cliente.findOne().sort({ codigo: -1 });
  // Si no hay registros se le asigna el codigo 1
  if (!ultimo) {
    codigo = 1;
  } else {
    codigo = ultimo.codigo + 1;
  }
  let cli_guardado = new Cliente({
    codigo: codigo,
    nombre: req.body.nombre,
    tipo: req.body.tipo,
    direccion: req.body.direccion,
    rfc: req.body.rfc,
    responsable: {
      nombre: req.body.responsable.nombre,
      apellido: req.body.responsable.apellido,
      telefono: req.body.responsable.telefono,
      correo: req.body.responsable.correo,
    },
    horario: {
      inicio: req.body.horario.inicio,
      fin: req.body.horario.fin,
    },
    estatus: req.body.estatus,
  });

  if (req.file) {
    const { filename } = req.file;
    cli_guardado.setimgurl(filename);
  }

  await cli_guardado.save();
  res.status(201).send({ cli_guardado });
});

router.put("/", upload.single("imagen"), async (req, res) => {
  let cli = await Cliente.findOne({ codigo: req.body.codigo });
  if (!cli) {
    return res.status(402).send("Cliente no encontrado");
  }

  let urlfotoanterior;
  if (cli.imagen) {
    urlfotoanterior = cli.imagen.split("/");
  }

  if (req.file) {
    const { filename } = req.file;
    cli.setimgurl(filename);
  }

  const imagen_anterior = cli.imagen;

  let cli_modificado = await Cliente.findOneAndUpdate(
    //Lo que se va a buscar
    { codigo: req.body.codigo },
    //Lo que se va a modificar
    {
      nombre: req.body.nombre,
      tipo: req.body.tipo,
      direccion: req.body.direccion,
      rfc: req.body.rfc,
      responsable: {
        nombre: req.body.responsable.nombre,
        apellido: req.body.responsable.apellido,
        telefono: req.body.responsable.telefono,
        correo: req.body.responsable.correo,
      },
      horario: {
        inicio: req.body.horario.inicio,
        fin: req.body.horario.fin,
      },
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

  res.send({ cli_modificado });
});

//Eliminar
router.delete("/eliminar/:codigo", async (req, res) => {
  let cli = await Cliente.findOne({ codigo: req.params.codigo });
  if (!cli) {
    return res.status(402).send("Cliente no encontrado");
  }

  let cli_eliminado = await Cliente.findOneAndDelete({
    codigo: req.params.codigo,
  });
  res.send({ cli_eliminado });
});

module.exports = router;