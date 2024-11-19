require("dotenv").config();
const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
const boletoCnpj = require("./routes/boletoCnpj");
const boletoCpf = require("./routes/boletoCpf");

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "https://grupomapscartaodigital.com.br", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, 
  })
);

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://grupomapscartaodigital.com.br");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200);
});

app.use(express.json());

app.use("/upload", uploadRoutes);
app.use("/generate-boleto-cnpj", boletoCnpj);
app.use("/generate-boleto-cpf", boletoCpf);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
