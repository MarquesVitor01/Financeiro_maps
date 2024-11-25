const express = require("express");
const getEfiPayInstance = require("../config/efipayConfig");

const router = express.Router();

router.post("/", async (req, res) => {
    const { email, birth, name, cpf, phone_number, items, shippingValue, account, dataVencimento } = req.body;

    if (!name || !email || !items || !cpf || !dataVencimento) {
        return res.status(400).send("Missing required fields.");
    }

    const efipay = getEfiPayInstance(account);
    let vencimentoDate;
    try {
      vencimentoDate = new Date(dataVencimento);
      if (isNaN(vencimentoDate)) {
        throw new Error("Invalid date");
      }
    } catch (error) {
      return res.status(400).send("Invalid date format for dataVencimento.");
    }

    const body = {
        payment: {
            banking_billet: {
                expire_at: vencimentoDate.toISOString().split("T")[0], 
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

module.exports = router;
