var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const mongoose = require("mongoose");
const https = require("https");
const fs = require("fs");

mongoose.set("strictQuery", true);

mongoose.connect("mongodb+srv://admin:admin2000@netline.assusam.mongodb.net/DB_Integral?retryWrites=true&w=majority");

// Lee los archivos de clave y certificado
const key = fs.readFileSync("./certs/key.pem");
const cert = fs.readFileSync("./certs/cert.pem");

// Configura las opciones para el servidor HTTPS
const options = {
  key: key,
  cert: cert,
};

//Listado de Modelos
require("./models/usuario");
require("./models/cliente");
require("./models/empleado");
require("./models/producto");
require("./models/proveedor");
require("./models/ordenservicio");
require("./models/dimensionamiento");
require("./models/cotizacion");
require("./models/servicio");
require("./models/controlAcceso");

//Listado de rutas
var indexRouter = require("./routes/index");
var usuariosRouter = require("./routes/usuarios");
var clientesRouter = require("./routes/clientes");
var empleadosRouter = require("./routes/empleados");
var productosRouter = require("./routes/productos");
var proveedoresRouter = require("./routes/proveedor");
var ordenserviciosRouter = require("./routes/ordenservicios");
var dimensionamientosRouter = require("./routes/dimensionamientos");
var cotizacionesRouter = require("./routes/cotizaciones");
var serviciosRouter = require("./routes/servicios");
var accesosRouter = require("./routes/controlAccesos");

var app = express();
app.use(
  cors({
    origin: "*",
    methods: "GET,PUT,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Crea el servidor HTTPS utilizando los archivos de clave y certificado
const httpsServer = https.createServer(options, app);

// Inicia el servidor en el puerto 443
httpsServer.listen(3001, () => {
  console.log("Servidor HTTPS iniciado en el puerto 3001");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/foto", express.static(path.join(__dirname + "/almacen/img")));

//URL para archivos de rutas
app.use("/", indexRouter);
app.use("/usuarios", usuariosRouter);
app.use("/clientes", clientesRouter);
app.use("/empleados", empleadosRouter);
app.use("/productos", productosRouter);
app.use("/proveedores", proveedoresRouter);
app.use("/ordenservicios", ordenserviciosRouter);
app.use("/dimensionamientos", dimensionamientosRouter);
app.use("/cotizaciones", cotizacionesRouter);
app.use("/servicios", serviciosRouter);
app.use("/accesos", accesosRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
