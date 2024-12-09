import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase/firebaseConfig";
import { QRCodeSVG } from 'qrcode.react';


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




  // Função para formatar a data no formato brasileiro
  const formatDateToBrazilian = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 3); // Ajuste para o horário de Brasília, se necessário
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // meses começam do zero
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };


  const formatValor = (value: string): string => {
    return value
      .replace(/\D/g, '') 
      .replace(/(\d)(\d{2})$/, '$1,$2'); 
  };
  return (
    clientData && (
      <div className="bonus card text-center mt-2">
        <h5 className="text-white ">BÔNUS</h5>
        <div className="d-flex justify-content-center my-1">
          {
            clientData.criacao === "sim" &&
            <div className="mx-2">
              <strong
                style={{
                  color: "red",
                }}
              >
                Criação
              </strong>
            </div>
          }
          {
            clientData.anuncio === "sim" &&
            <div className="mx-2" >
              <strong
                style={{
                  color: "red",
                }}
              >
                Anúncio
              </strong>
            </div>
          }
          {
            clientData.ctdigital === "sim" &&
            <div className="mx-2" >
              <strong
                style={{
                  color: "red",
                }}
              >
                Cartão Digital
              </strong>
            </div>
          }
          {clientData.logotipo === "sim" &&
            <div className="mx-2" >
              <strong
                style={{
                  color: "red",
                }}
              >
                Logotipo
              </strong>
            </div>
          }
        </div>


        <div className="form-group">
          <p>
            <strong>
            Como acordado, segue o plano no valor de <u>R$ {clientData.valorVenda ? formatValor(clientData.valorVenda) : ""}</u>, a ser pago em <u>{clientData.parcelas} parcela(s){clientData.parcelas > 1 && ` de R$ ${clientData.valorParcelado ? formatValor(clientData.valorParcelado) : ""}`}</u>, via <u>{clientData.formaPagamento}</u>, com o vencimento para o dia <u>{formatDateToBrazilian(clientData.dataVencimento)}</u>.
            </strong>
          </p>
        </div>

        <p className="">
          O PAGAMENTO PODE SER FEITO ATRAVÉS DO BOLETO BANCÁRIO OU PIX QR-CODE DISPONÍVEL NO BOLETO, ENVIADO ATRAVÉS DO E-MAIL E WHATSAPP DO CONTRATANTE.
          <br />
          ACEITE REALIZADO DE FORMA VERBAL; PARA VERIFICAR SUA ADESÃO.
          <br />
          APONTE A CÂMERA DO CELULAR PARA O QRCODE ABAIXO:
        </p>
        <div className="">
          {clientData.qrcodeText && (
            <div className="">
              <QRCodeSVG value={clientData.qrcodeText} size={105} />
            </div>
          )}
        </div>

        <h5 className="mt-2">CENTRAL DE ATENDIMENTO</h5>
        <p>0800 050 0069 / 0800 580 2766 / (11) 3195-8710</p>
        <p>
          <a href="mailto:MARKETING@GRUPOMAPSEMPRESAS.com.br">
            MARKETING@GRUPOMAPSEMPRESAS.com.br
          </a>
          <br />
          <a href="mailto:CONTATO@GRUPOMAPSEMPRESAS.com.br">
            CONTATO@GRUPOMAPSEMPRESAS.com.br
          </a>
        </p>
        {/* <p>PARA ATENDIMENTO VIA WHATSAPP BASTA CLICAR NO ÍCONE ABAIXO:</p>
        <a
          href="https://wa.link/ulgll4"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/img/img-wpp-contrato.webp"
            alt="WhatsApp"
            style={{ width: "170px" }}
          />
        </a> */}
      </div>
    )
  );
};
