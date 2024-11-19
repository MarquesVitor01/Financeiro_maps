const EfiPay = require("sdk-node-apis-efi");

const getEfiPayInstance = (account) => {
  let efipayOptions;

  switch (account) {
    case "equipe_marcio":
      efipayOptions = {
        client_id: process.env.EFI_ACCOUNT1_CLIENT_ID,
        client_secret: process.env.EFI_ACCOUNT1_CLIENT_SECRET,
        sandbox: process.env.EFI_SANDBOX === "true",
      };
      break;
    case "equipe_kaio":
      efipayOptions = {
        client_id: process.env.EFI_ACCOUNT2_CLIENT_ID,
        client_secret: process.env.EFI_ACCOUNT2_CLIENT_SECRET,
        sandbox: process.env.EFI_SANDBOX === "true",
      };
      break;
    case "equipe_antony":
      efipayOptions = {
        client_id: process.env.EFI_ACCOUNT3_CLIENT_ID,
        client_secret: process.env.EFI_ACCOUNT3_CLIENT_SECRET,
        sandbox: process.env.EFI_SANDBOX === "true",
      };
      break;
    default:
      efipayOptions = {
        client_id: process.env.EFI_DEFAULT_CLIENT_ID,
        client_secret: process.env.EFI_DEFAULT_CLIENT_SECRET,
        sandbox: process.env.EFI_SANDBOX === "true",
      };
      break;
  }

  return new EfiPay(efipayOptions);
};

module.exports = getEfiPayInstance;
