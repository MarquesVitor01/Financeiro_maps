require("dotenv").config();
const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
const boletoCnpj = require("./routes/boletoCnpj");
const boletoCpf = require("./routes/boletoCpf");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: "https://grupomapscartaodigital.com.br",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());

app.use(express.json());

app.use("/upload", uploadRoutes);
app.use("/generate-boleto-cnpj", boletoCnpj);
app.use("/generate-boleto-cpf", boletoCpf);

app.get("/test-cors", (req, res) => {
  res.json({ message: "CORS is working!" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
