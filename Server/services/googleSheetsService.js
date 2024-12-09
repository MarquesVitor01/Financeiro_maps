const { google } = require("googleapis");
const path = require("path");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "../certs/credenciais/crm-maps-593d1-0a3f3365aa19.json"),
  scopes: SCOPES,
});

const sheets = google.sheets({ version: "v4", auth });

const writeToSheet = async (data) => {
  try {
    const spreadsheetId = "1FqWGW8hSEHs7pBPtKR2NdjRHYJ24heY323FflklcB9s";
    const range = "Gmaps - Automação!A2";
    const valueInputOption = "RAW";

    const existingData = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Gmaps - Automação!A2:A",
    });

    const existingNumeroContratos = existingData.data.values
      ? existingData.data.values.map((row) => row[0])
      : [];

    const uniqueData = data.filter(
      (row) => !existingNumeroContratos.includes(row.numeroContrato)
    );

    if (uniqueData.length > 0) {
      const batchedData = uniqueData.map((row) => [
        row.numeroContrato,
        row.cnpj,
        row.cpf,
        row.responsavel,
        row.email1,
        row.email2,
        row.operador,
        row.data,
        row.dataVencimento,
        row.contrato,
        row.nomeMonitor,
        row.artLink,
        row.celular,
        row.anuncio ? "Sim" : "Não",
        row.monitoriaConcluidaYes ? "Sim" : "Não",
        row.servicosConcluidos ? "Sim" : "Não",
      ]);

      const resource = { values: batchedData };

      const result = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption,
        resource,
      });

      console.log("Planilha atualizada:", result.data);
    } else {
      console.log("Nenhum dado novo para adicionar.");
    }
  } catch (error) {
    console.error("Erro ao atualizar a planilha:", error);
    throw error;
  }
};

module.exports = { writeToSheet };
