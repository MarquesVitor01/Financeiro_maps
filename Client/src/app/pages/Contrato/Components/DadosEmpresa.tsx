import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { useParams } from "react-router-dom";

export const DadosEmpresa: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [clientData, setClientData] = useState<any>(null);

  const formatCNPJ = (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
      .replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5")
      .substring(0, 18);
  };
  
  const formatCPF = (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
      .substring(0, 14);
  };

  const formatCelular = (value: string): string => {
    return value
      .replace(/\D/g, "") 
      .replace(/^(\d{2})(\d)/, "($1) $2") 
      .replace(/(\d{5})(\d{5})$/, "$1-$2") 
      .substring(0, 15); 
  };

  const formatFixo = (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/^(\(\d{2}\)) (\d{4})(\d)/, "$1 $2-$3")
      .substring(0, 14);
  };

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
    clientData && (
      <div className="dados-empresa card p-4 my-1">
        <h5 className="text-center font-weight-bold">DADOS DA EMPRESA</h5>
        <div className="row">
          <div className="col-md-6 mb-1">
            <div className="p-2 bg-light rounded">
              <p>
                <strong>RAZÃO SOCIAL:</strong> {clientData.razaoSocial}
              </p>
              <p>
                <strong>NOME FANTASIA:</strong> {clientData.nomeFantasia}
              </p>
              <p>
                <strong>BAIRRO:</strong> {clientData.bairro}
              </p>
              <p>
                <strong>ESTADO:</strong> {clientData.estado}
              </p>
              <p>
      <strong>CNPJ/CPF:</strong>{" "}
      {clientData.cnpj ? formatCNPJ(clientData.cnpj) : clientData.cpf ? formatCPF(clientData.cpf) : ""}
    </p>
              <p>
                <strong>ENDEREÇO COMERCIAL:</strong> {clientData.enderecoComercial}
              </p>
              <p>
                <strong>CEP:</strong> {clientData.cep}
              </p>
              <p>
                <strong>CIDADE:</strong> {clientData.cidade}
              </p>
            </div>
          </div>
          <div className="col-md-6 mb-1">
            <div className="p-2 bg-light rounded">
              <p>
                <strong>TELEFONE:</strong> { clientData.fixo ? formatFixo(clientData.fixo) : ""}
              </p>
              <p>
                <strong>CELULAR:</strong> { clientData.celular ? formatCelular(clientData.celular) : ""}
              </p>
              <p>
                <strong>WHATSAPP:</strong> { clientData.whatsapp ? formatCelular(clientData.whatsapp) : ""}
              </p>
              <p>
                <strong>HORÁRIO DE FUNCIONAMENTO:</strong> {clientData.horario}
              </p>
              <p>
                <strong>1º E-MAIL:</strong> {clientData.email1}
              </p>
              <p>
                <strong>2º E-MAIL:</strong> {clientData.email2 || "N/A"}
              </p>
              <p>
                <strong>LINK DA PÁGINA GOOGLE:</strong>{" "}
                <a
                  href={`https://${clientData.linkGoogle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {clientData.linkGoogle}
                </a>
              </p>
              <p>
                <strong>OBSERVAÇÕES:</strong> {clientData.obs}
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 p-2">
          <div className="bg-light rounded">
            <div className="row">
              <div className="col-6">
                <p>
                  <strong>NOME DO RESPONSÁVEL:</strong> {clientData.responsavel}
                </p>
              </div>
              <div className="col-6">
                <p>
                  <strong>CARGO:</strong> {clientData.cargo}
                </p>
              </div>  
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center my-3">
          <div className="flex-grow-1 border-top"></div>
          <span className="mx-5 font-weight-bold">
            RENOVAÇÃO AUTOMÁTICA: {clientData.renovacaoAutomatica}
          </span>
          <div className="flex-grow-1 border-top"></div>
        </div>
      </div>
    )
  );
};
