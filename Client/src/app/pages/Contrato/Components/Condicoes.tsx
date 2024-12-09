import { faLeftLong, faRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase/firebaseConfig";

export const Condicoes: React.FC = () => {

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

  return (

    clientData &&(
    <div className="condicoes">
      <h2>CONDIÇÕES</h2>
      <p>
      {" "}
                1º- ESTOU CIENTE QUE PARA CRIAÇÃO OU ATUALIZAÇÃO DA MINHA PAGÍNA
                DEVO ENCAMINHAR PARA A EMPRESA CONTRATADA QUANDO SOLICITADO POR
                PARTE DA EQUIPE DE SUPORTE TODAS AS INFORMAÇÕES NECESSARIAS.{" "}
                <br /> 2º- TODAS AS SOLICITAÇÕES DEVERÃO SER ENCAMINHADAS PARA O
                DEPARTAMENTO DE MARKETING ATRAVÉS DO E-MAIL OU WHATSAPP AQUI
                DISPONIBILIZADOS CENTRAL DE ATENDIMENTO; 0800 580 2766 / 0800
                050 0069 E-MAIL: MARKETING@GRUPOMAPSEMPRESAS.COM.BR
                <br /> 3º- ASSUMO TAMBÉM A TOTAL RESPONSABILIDADE E AUTORIZO QUE
                A EMPRESA CONTRATADA DIVULGUE OS MEUS DADOS COMERCIAIS NO SITE
                DE BUSCA.
                <br /> 4º SOBRE AS CONDIÇÕES ASSUMO AS OBRIGAÇÕES COM ESTA
                PRESTAÇÃO DE SERVIÇOS DE MARKETING DIGITAL REALIZADA PELA
                EMPRESA G MAPS CONTACT CENTER LTDA CNPJ; 40.407.753/0001-30
                TENDO CIÊNCIA DO VALOR DE R$ 
                <span>{clientData.valorVenda} </span>
                NO PLANO {clientData.validade}.
                <br /> 5º-SABENDO QUE O NÃO PAGAMENTO PODE GERAR A NEGATIVAÇÃO
                DO CPF/CNPJ JUNTO AOS ORGÃOS COMPETENTES (SERASA/CARTÓRIO). E A
                COBRANÇA ANTECIPADA DO SEU PERÍODO DE VALIDADE. <br />{" "}
                <u>
                  6º- ACEITE DOS SERVIÇOS FOI REALIZADA DE FORMA VERBAL CONFORME
                  O ARTIGO 107 DO CODIGO CIVIL LEI 10406 DE 10 DE JANEIRO DE
                  2002 E QUE A CÓPIA DESTE CONTRATO FOI ENCAMINHADA PARA O
                  E-MAIL PRINCIPAL INFORMADO ACIMA.
                </u>
                <br />
                7º-A CONTRATADA ASSUME AS OBRIGAÇÕES JUNTO A CONTRATANTE DE
                CONCLUIR E ENTREGAR OS SERVIÇOS PRESTADOS DENTRO DO PERÍODO DE
                ATÉ 72 HORAS ÚTEIS.
      </p>
      <div className="image-container">
        <FontAwesomeIcon icon={faRightLong} className="arrow right" color="yellow" />
        <a href="https://drive.google.com/file/d/17YZoqz97bDo_1fWqzaDggmdN1iQSnMtn/view"><img src="/img/img-termos.webp" alt="Imagem dos Termos" /></a>
        <FontAwesomeIcon icon={faLeftLong} className="arrow left" color="yellow"/>
      </div>

      <p className="text-center text-decoration-underline fw-bold">CLIQUE NA IMAGEM ACIMA PARA VERIFICAR OS TERMOS</p>
    </div>
    )
  );
};
