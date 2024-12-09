import React, { useEffect, useState } from "react";
import "./Styles/FichaFinanceiro.css";
import { FinanceiroForm } from "./Components/FinanceiroForm";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { useNavigate, useParams } from "react-router-dom";

export const FichaFinanceiro: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (id) {
          const docRef = doc(db, "financeiros", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setClientData(docSnap.data());
          } else {
            console.log("Documento não encontrado");
          }
        }
      } catch (error) {
        console.error("Erro ao buscar os dados do cliente: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id]);

  const handleFianceiroSubmit = async (data: any) => {
    try {
      if (id) {
        const docRef = doc(db, "financeiros", id);
        await updateDoc(docRef, data);
        setClientData(data);
        console.log("Dados atualizados com sucesso!");
        navigate("/financeiro");
      }
    } catch (error) {
      console.error("Erro ao atualizar os dados de financeiro: ", error);
    }
  };

  if (loading) {
    return <div>Carregando dados...</div>;
  }

  if (!clientData) {
    return <div>Dados não encontrados.</div>;
  }

  return (
    <div className="financeiro">
      <div className="container">
        <div className="row align-items-center gap-3">
          <div className="col-md-6">
            <div className="card card-cob p-4">
              <h2 className="text-center">Informações Gerais</h2>
              <p>
                <strong>CNPJ:</strong> {clientData.cnpj || clientData.cpf}
              </p>
              <p>
                <strong>Telefone:</strong> {clientData.telefone || clientData.celular}
              </p>
              <p>
                <strong>Vencimento:</strong> {clientData.dataVencimento || "Não informado"}
              </p>
              <p>
                <strong>Valor original da venda:</strong> {clientData.valorVenda || "Não informado"}
              </p>
              <p>
                <strong>Valor Pago:</strong> {clientData.valorPago || "Não informado"}
              </p>

              {(clientData.operadorSelecionado && clientData.acordo) && (
                <>
                  <p>
                    <strong>Possui acordo com a cobrança:</strong> {clientData.acordo}
                  </p>
                  <p>
                    <strong>Cobrador:</strong> {clientData.operadorSelecionado.label}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="col-md-5">
            <FinanceiroForm form={clientData} onSubmit={handleFianceiroSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};
