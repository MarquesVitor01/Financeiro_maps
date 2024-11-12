require("dotenv").config();
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https");
const admin = require("firebase-admin");
const EfiPay = require("sdk-node-apis-efi");
const cors = require("cors");

const cert = fs.readFileSync(
  path.resolve(__dirname, `./certs/${process.env.GN_CERT}`)
);
const agent = new https.Agent({
  pfx: cert,
  passphrase: process.env.GN_CERT_PASSPHRASE || "", 
});

const efipayOptions = {
  client_id: process.env.EFI_CLIENT_ID,
  client_secret: process.env.EFI_CLIENT_SECRET,
  sandbox: process.env.EFI_SANDBOX === "true",
};
const efipay = new EfiPay(efipayOptions);

const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const app = express();
const port = process.env.PORT || 5000;
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
}));
app.use(express.json());

const bucket = admin.storage().bucket();
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const blob = bucket.file(`images/${req.file.originalname}`);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  blobStream.on("error", (error) => {
    res.status(500).send(error);
  });

  blobStream.on("finish", async () => {
    const url = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    res.status(200).send({ imageUrl: url });
  });

  blobStream.end(req.file.buffer);
});

app.post("/generate-boleto", async (req, res) => {
  const { name, email, cpf, birth, phone_number, items, shippingValue } = req.body;

  if (!name || !email || !cpf || !items) {
    return res.status(400).send("Missing required fiel'ds.");
  }

  const body = {
    payment: {
      banking_billet: {
        expire_at: new Date(new Date().setDate(new Date().getDate() + 7))
          .toISOString()
          .split("T")[0],
        customer: {
          name,
          email,
          cpf,
          birth,
          phone_number,
        },
      },
    },
    items,
    shippings: [
      {
        name: "Default Shipping Cost",
        value: shippingValue || 0,
      },
    ],
  };

  try {
    const response = await efipay.createOneStepCharge([], body);
    res.status(200).send(response);
  } catch (error) {
    console.error("Erro ao gerar boleto:", error.response?.data || error.message, error.config);
    res.status(500).send("Error generating boleto.");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
