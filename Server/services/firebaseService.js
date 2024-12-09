const firebaseAdmin = require("firebase-admin");
const path = require("path");

if (!firebaseAdmin.apps.length) {
  const serviceAccount = require("../certs/credenciais/crm-maps-593d1-firebase-adminsdk-c3nwi-19f474e359.json");
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
  });
} else {
  firebaseAdmin.app();
}

module.exports = firebaseAdmin;
