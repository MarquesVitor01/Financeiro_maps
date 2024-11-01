import React from "react";
import { QRCodeSVG } from 'qrcode.react';


interface InfoConfirmacao {
  monitoriaConcluidaYes: boolean;
  monitoriaConcluidaNo: boolean
  nomeMonitor: string;
  qrcodeText: string;
}

interface InfoConfirmacaoProps {
  form: InfoConfirmacao | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const questions = [
  {
    label: "Confirma que realizou a auditoria?",
    yesId: "monitoriaConcluidaYes",
    noId: "monitoriaConcluidaNo",
    yesChecked: (form: InfoConfirmacao) => form.monitoriaConcluidaYes,
    noChecked: (form: InfoConfirmacao) => form.monitoriaConcluidaNo,
  },
];




export const FichaMonitoriaConfirmacao: React.FC<InfoConfirmacaoProps> = ({ form, handleInputChange }) => {
  if (!form) return null;

  return (
    <>
      <h3 className="text-center">Auditoria</h3>
      <div className="row monitoria">
        {questions.map(({ label, yesId, noId, yesChecked, noChecked }) => (
          <div className="col-md-6 box-quest" key={yesId}>
            <label>{label}</label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={yesId}
                checked={yesChecked(form)}
                onChange={handleInputChange}
              />
              <label className="form-check-label" htmlFor={yesId}>Sim</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={noId}
                checked={noChecked(form)}
                onChange={handleInputChange}
              />
              <label className="form-check-label" htmlFor={noId}>Não</label>
            </div>
          </div>


        ))}
        <div className="col-md-6 box-quest">
          <label>Informe seu nome:</label>
          <input
            className="form-control"
            id="nomeMonitor"
            name="nomeMonitor"
            value={form.nomeMonitor}
            onChange={handleInputChange}
            placeholder="Digite seu nome aqui"
          />
        </div>
        <div className="col-md-6 box-quest">
          <label>Informe o Qrcode:</label>
          <input
            className="form-control"
            id="qrcodeText"
            name="qrcodeText"
            value={form.qrcodeText}
            onChange={handleInputChange}
            placeholder="Digite seu nome aqui"
          />
        </div>
        {form.qrcodeText && (
        <div className="mt-3 justify-content-center d-flex flex-column align-items-center">
          <h5>QR Code:</h5>
          <QRCodeSVG value={form.qrcodeText} size={128} />
        </div>
      )}
      </div>
    </>
  );
};
