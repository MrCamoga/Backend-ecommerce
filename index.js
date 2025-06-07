const express = require("express");
const app = express();
const { typeError } = require('./middleware/validation');

const PORT = 3000;

app.use(express.json());

app.get("/", (req,res) => res.send("Welcome"));

const endpoints = ["products","categories","orders","auth","users","reviews"];

endpoints.forEach(endpoint => app.use(`/${endpoint}`, require(`./routes/${endpoint}`)));

app.use(typeError);

app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));
