import React, { FC } from "react";
import "./Styles/Contrato.css";
import { Header } from "./Components/Header";
import { DadosEmpresa } from "./Components/DadosEmpresa";
import { Condicoes } from "./Components/Condicoes";
import { Bonus } from "./Components/Bonus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import html2pdf from "html2pdf.js"; 

const Contrato: FC = () => {
  const downloadPDF = () => {
    const contratoElement = document.getElementById("contrato");
    const condicoesElement = document.querySelector('.condicoes p') as HTMLElement;
    const bgInfosContrato = document.querySelector('.bg-infos-contrato') as HTMLElement;

    if (contratoElement && condicoesElement && bgInfosContrato) {
      const originalCondicoesWidth = condicoesElement.style.width;
      const originalPadding = bgInfosContrato.style.padding;

      condicoesElement.style.width = "680px";
      bgInfosContrato.style.padding = "0"; 

      const opt = {
        margin: 0.5,
        filename: 'contrato.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      };

      html2pdf()
        .set(opt)
        .from(contratoElement)
        .save()
        .then(() => {
          condicoesElement.style.width = originalCondicoesWidth;
          bgInfosContrato.style.padding = originalPadding;
        })
        .catch((error: unknown) => {
          console.error("Erro ao gerar PDF:", error);
          alert("Houve um erro ao gerar o PDF. Tente novamente.");
        });
    } else {
      alert("Erro: Um ou mais elementos não foram encontrados.");
    }
  };

  return (
    <div className="bg-contrato">
      <div className="bg-infos-contrato" id="contrato">
      <Header />
        <DadosEmpresa />
        <Condicoes />
        <Bonus />
      </div>
      <button className="btn btn-danger mt-4" onClick={downloadPDF}>
        <FontAwesomeIcon icon={faFilePdf} /> Baixar PDF
      </button>
    </div>
  );
};

export default Contrato;
