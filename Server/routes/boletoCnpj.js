const express = require("express");
const getEfiPayInstance = require("../config/efipayConfig");

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, juridical_person, phone_number, items, shippingValue, account } = req.body;

  if (!email || !items || !juridical_person) {
    return res.status(400).send("Missing required fields.");
  }

  const efipay = getEfiPayInstance(account);

  const body = {
    payment: {
      banking_billet: {
        expire_at: new Date(new Date().setDate(new Date().getDate() + 7))
          .toISOString()
          .split("T")[0],
        customer: {
          email,
          phone_number,
          juridical_person
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

module.exports = router;
