const fs = require("fs");
const path = require("path");
const https = require("https");

const cert = fs.readFileSync(
  path.resolve(__dirname, `../../certs/${process.env.GN_CERT}`)
);

const agent = new https.Agent({
  pfx: cert,
  passphrase: process.env.GN_CERT_PASSPHRASE || "",
});

module.exports = agent;
