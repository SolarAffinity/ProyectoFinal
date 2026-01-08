import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";

import { connectMongo } from "./config/mongo.js";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// handlebars 
app.engine(
  "handlebars",
  handlebars.engine({
    helpers: {
      json: (context) => JSON.stringify(context)
    }
  })
);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// mongo
connectMongo();

app.listen(8080, () => {
  console.log("Servidor corriendo en puerto 8080");
});
