require("dotenv").config();
const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
const boletoCnpj = require("./routes/boletoCnpj");
const boletoCpf = require("./routes/boletoCpf");
const chargeRoutes = require("./routes/boletoStatus");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "https://grupomapscartaodigital.com.br",
  // origin: process.env.FRONTEND_URL || "http://localhost:3000",
}));
app.use(express.json());

app.use("/upload", uploadRoutes);
app.use("/generate-boleto-cnpj", boletoCnpj);
app.use("/generate-boleto-cpf", boletoCpf);
app.use("/v1/charge", chargeRoutes);

// Exporte como função para a Vercel
module.exports = app;


// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });
