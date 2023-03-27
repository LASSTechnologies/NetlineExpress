var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
//Libreria de mongoose para manipular los datos
const mongoose = require("mongoose");

//Referencia del Schema para usarlo en las rutas de apirest
const Usuario = mongoose.model("Usuario");

/* GET users listing. */
//Consultar todo
router.get("/", async (req, res) => {
  await Usuario.find((err, usu) => {
    if (err) {
      return res.send("No hay información");
    }
    res.send(usu);
  }).clone();
});

//Consultar un solo documento
router.get("/datos/:usu", async (req, res) => {
  let usuario = await Usuario.findOne({ nombre: req.params.usu });
  if (!usuario) {
    return res.status(402).send("Usuario no encontrado");
  }
  res.send({ usuario });
});

//Guardar
router.post("/", async (req, res) => {
  let ultimo = await Usuario.findOne().sort({ codigo: -1 });
  if (!ultimo) {
    codigo = 1;
  } else {
    codigo = parseInt(ultimo.codigo) + 1;
  }
  let salt = await bcrypt.genSalt(10);
  let pass = await bcrypt.hash(req.body.contra, salt);
  let usu = new Usuario({
    nombre: req.body.usuario,
    contra: pass,
    tipo: req.body.tipo,
  });

  await usu.save();
  res.send({ usu });
});

//Modificar
router.put("/", async (req, res) => {
  let usu = await Usuario.findOne({ nombre: req.body.nombre });
  if (!usu) {
    return res.status(402).send("Usuario no encontrado");
  }

  let salt = await bcrypt.genSalt(10);
  let pass = await bcrypt.hash(req.body.contra, salt);
  let usu_modificado = await Usuario.findOneAndUpdate(
    //Lo que se va a buscar
    { nombre: req.body.nombre },
    //Lo que se va a modificar
    {
      contra: pass,
      tipo: req.body.tipo,
    },
    //Lo que se va a retornar, true = Objeto modificado || false = Objeto antes de modificar
    {
      new: true,
    }
  );

  res.send({ usu_modificado });
});

//Eliminar
router.delete("/delete/:usuario", async (req, res) => {
  let usu = await Usuario.findOne({ nombre: req.params.usuario });
  if (!usu) {
    return res.status(402).send("Usuario no encontrado");
  }

  let usu_eliminado = await Usuario.findOneAndDelete({
    nombre: req.params.usuario,
  });
  res.send({ usu_eliminado });
});

//Eliminar con metodo post
router.post("/delete", async (req, res) => {
  let usu = await Usuario.findOne({ nombre: req.body.usuario });
  if (!usu) {
    return res.status(402).send("Usuario no encontrado");
  }

  let usu_eliminado = await Usuario.findOneAndDelete({
    nombre: req.body.usuario,
  });
  res.send({ usu_eliminado });
});

//Inicio de sesión
//Daniel.123
router.post(
  "/iniciosesion",
  body("nombre")
    .notEmpty()
    .withMessage("Este campo no puede estar vacio")
    .isEmail()
    .withMessage("Introduce un correo elctronico valido"),
  async (req, res) => {
    let errores = validationResult(req);

    if (!errores.isEmpty()) {
      return res.status(402).json({ error: errores.array() });
    }

    let usu = await Usuario.findOne({ nombre: req.body.nombre });
    if (!usu) {
      return res.status(402).send("Usuario o contraseña incorrectosusu");
    }

    //if (usu.contra != req.body.contra) {
    if (!(await bcrypt.compare(req.body.contra, usu.contra))) {
      return res.status(402).send("Usuario o contraseña incorrectoscontra");
    }

    res.send({ usu });
  }
);

//Cambiar contraseña
router.put(
  "/contra",
  body("contraNueva")
    .isStrongPassword({
      minLength: 5,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    })
    .withMessage(
      "Elige una contraseña mas segura \n Minimo 8 caracteres, utiliza al menos una mayuscula, una minuscula, un numero y un simbolo"
    ),
  async (req, res) => {
    let errores = validationResult(req);

    if (!errores.isEmpty()) {
      return res.status(402).json({ error: errores.array() });
    }

    let usu = await Usuario.findOne({ nombre: req.body.nombre });
    if (!usu) {
      return res.status(402).json({ error: "Usuario no encontrado" });
    }

    if (await bcrypt.compare(req.body.contraAnterior, usu.contra)) {
      let salt = await bcrypt.genSalt(10);
      let pass = await bcrypt.hash(req.body.contraNueva, salt);
      let usu_modificado = await Usuario.findOneAndUpdate(
        { nombre: req.body.nombre },
        { contra: pass },
        { new: true }
      );
      return res.json({ message: "Cambio de contraseña correcto" });
    } else {
      return res
        .status(402)
        .json({ error: "Error al cambiar contraseña, vuelva a intentarlo" });
    }
  }
);
//router.put("/contra",
//  body('contraNueva').isStrongPassword({ minLength: 5, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 }).withMessage('Elige una contraseña mas segura \n Minimo 8 caracteres, utiliza al menos una mayuscula, una minuscula, un numero y un simbolo'),
//  async (req, res) => {

//    let errores = validationResult(req);

//    if (!errores.isEmpty()) {
//      return res.status(402).json({ error: errores.array() });
//    }

//    let usu = await Usuario.findOne({ nombre: req.body.nombre });
//    if (!usu) {
//      return res.status(402).send("Usuario no encontrado");
//    }

//    if (await bcrypt.compare(req.body.contraAnterior, usu.contra)) {
//      let salt = await bcrypt.genSalt(10);
//      let pass = await bcrypt.hash(req.body.contraNueva, salt);
//      let usu_modificado = await Usuario.findOneAndUpdate(
//        //Lo que se va a buscar
//        { nombre: req.body.nombre },
//        //Lo que se va a modificar
//        {
//          contra: pass,
//        },
//        //Lo que se va a retornar, true = Objeto modificado || false = Objeto antes de modificar
//        {
//          new: true,
//        }
//      );
//    } else {
//      return res.status(402).send("Error al cambiar contraseña, Vuelva a intentarlo");
//    }

//    res.send("Cambio correcto");
//  });

module.exports = router;

