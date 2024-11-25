exports.validateBoletoRequest = (req, res, next) => {
  const { account, email, items, juridical_person, name, cpf, dataVencimento } = req.body;

  if (!account || !["equipe_marcio", "equipe_kaio", "equipe_antony"].includes(account)) {
    return res.status(400).send("Account selection is required and must be valid.");
  }

  if ( !email || !items || juridical_person || !dataVencimento) {
    return res.status(400).send("Missing required fields.");
  } else if ( !email || !items || !name || !cpf) {
    return res.status(400).send("Missing required fields.");
  }

  next();
};
