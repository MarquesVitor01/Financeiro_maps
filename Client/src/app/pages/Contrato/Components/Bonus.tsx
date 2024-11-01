import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebaseConfig";
import { QRCodeSVG } from 'qrcode.react';

type Option = "criacao" | "anuncio" | "cartaoDigital" | "logotipo";

export const Bonus: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [clientData, setClientData] = useState<any>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (id) {
          const docRef = doc(db, "vendas", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setClientData(docSnap.data());
          } else {
            console.log("Não encontrado");
          }
        }
      } catch (error) {
        console.error("Erro ao buscar os dados do cliente: ", error);
      }
    };

    fetchClientData();
  }, [id]);

  const [selectedOptions, setSelectedOptions] = useState({
    criacao: false,
    anuncio: false,
    cartaoDigital: true,
    logotipo: true,
  });

  const toggleOption = (option: Option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  // Função para formatar a data no formato brasileiro
  const formatDateToBrazilian = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 3); // Ajuste para o horário de Brasília, se necessário
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // meses começam do zero
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    clientData && (
      <div className="bonus card text-center mt-4">
        <h5 className="text-white py-2">BÔNUS</h5>
        <div className="d-flex justify-content-center my-1">
          <div className="mx-2" onClick={() => toggleOption("criacao")}>
            <strong
              style={{
                textDecoration: selectedOptions.criacao ? "none" : "line-through",
                color: selectedOptions.criacao ? "black" : "red",
                cursor: "pointer",
              }}
            >
              Criação
            </strong>
          </div>
          <div className="mx-2" onClick={() => toggleOption("anuncio")}>
            <strong
              style={{
                textDecoration: selectedOptions.anuncio ? "none" : "line-through",
                color: selectedOptions.anuncio ? "black" : "red",
                cursor: "pointer",
              }}
            >
              Anúncio
            </strong>
          </div>
          <div className="mx-2" onClick={() => toggleOption("cartaoDigital")}>
            <strong
              style={{
                textDecoration: selectedOptions.cartaoDigital ? "none" : "line-through",
                color: selectedOptions.cartaoDigital ? "black" : "red",
                cursor: "pointer",
              }}
            >
              Cartão Digital
            </strong>
          </div>
          <div className="mx-2" onClick={() => toggleOption("logotipo")}>
            <strong
              style={{
                textDecoration: selectedOptions.logotipo ? "none" : "line-through",
                color: selectedOptions.logotipo ? "black" : "red",
                cursor: "pointer",
              }}
            >
              Logotipo
            </strong>
          </div>
        </div>

        <div className="form-group">
          <p>
            <strong>
              Como acordado, segue o plano no valor de <u>R$ {clientData.valorVenda}</u>, a ser pago em <u>{clientData.parcelas} parcela(s)</u>, via <u>{clientData.formaPagamento}</u>, com o vencimento para o dia <u>{formatDateToBrazilian(clientData.dataVencimento)}</u>.
            </strong>
          </p>
        </div>

        <p className="mt-2">
          O PAGAMENTO PODE SER FEITO ATRAVÉS DO BOLETO BANCÁRIO OU PIX QR-CODE DISPONÍVEL NO BOLETO, ENVIADO ATRAVÉS DO E-MAIL E WHATSAPP DO CONTRATANTE.
          <br />
          ACEITE REALIZADO DE FORMA VERBAL; PARA VERIFICAR SUA ADESÃO.
          <br />
          APONTE A CÂMERA DO CELULAR PARA O QRCODE ABAIXO:
        </p>
        <div className="">
          {clientData.qrcodeText && (
            <div className="mt-3">
              <QRCodeSVG value={clientData.qrcodeText} size={128} />
            </div>
          )}
        </div>

        <h5 className="mt-2">CENTRAL DE ATENDIMENTO</h5>
        <p>(11) 4200-6110 / 0800 050 0069</p>
        <p>
          <a href="mailto:MARKETING@GRUPOMAPSEMPRESAS.com.br">
            MARKETING@GRUPOMAPSEMPRESAS.com.br
          </a>
          <br />
          <a href="mailto:CONTATO@GRUPOMAPSEMPRESAS.com.br">
            CONTATO@GRUPOMAPSEMPRESAS.com.br
          </a>
        </p>
        <p>PARA ATENDIMENTO VIA WHATSAPP BASTA CLICAR NO ÍCONE ABAIXO:</p>
        <a
          href="https://wa.me/551142006110"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/img/img-wpp-contrato.webp"
            alt="WhatsApp"
            style={{ width: "200px" }}
          />
        </a>
      </div>
    )
  );
};
