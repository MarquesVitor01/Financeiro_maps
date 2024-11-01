import React, { useEffect, useState } from "react";
import "./Styles/fichamonitoria.css";
import { FichaMonitoriaGrave } from "./Components/FichaMonitoriaGrave";
import { FichaMonitoriaAuditoria } from "./Components/FichaMonitoriaAuditoria";
import { FichaMonitoriaQualidade } from "./Components/fichaMonitoriaQualidade";
import { FichaMonitoriaConfirmacao } from "./Components/FichaMonitoriaConfirmacao";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useNavigate, useParams } from "react-router-dom";

interface ClientData {
  googleInfoYes: boolean;
  googleInfoNo: boolean;
  discountWithoutAuthorizationYes: boolean;
  discountWithoutAuthorizationNo: boolean;
  vencimentoYes: boolean;
  vencimentoNo: boolean;
  observation: string;
  nameInfoYes: boolean;
  nameInfoNo: boolean;
  mapsInfoYes: boolean;
  mapsInfoNo: boolean;
  infosYes: boolean;
  infosNo: boolean;
  optionsBuyYes: boolean;
  optionsBuyNo: boolean;
  confirmacaoYes: boolean;
  confirmacaoNo: boolean;
  nomeAutorizanteYes: boolean;
  nomeAutorizanteNo: boolean;
  nameClientYes: boolean;
  nameClientNo: boolean;
  valorDataYes: boolean;
  valorDataNo: boolean;
  monitoriaConcluidaYes: boolean;
  monitoriaConcluidaNo: boolean;
  nomeMonitor: string;
  qrcodeText: string;
}

export const FichaMonitoria: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (id) {
          const docRef = doc(db, "vendas", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setClientData(docSnap.data() as ClientData);
          } else {
            console.log("Cliente não encontrado.");
          }
        }
      } catch (error) {
        console.error("Erro ao buscar os dados do cliente: ", error);
      }
    };

    fetchClientData();
  }, [id]);

    const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, type, value } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    
    setClientData((prevData) => {
      if (prevData) {
        const updatedData: ClientData = {
          ...prevData,
          [id]: type === "checkbox" ? checked : value,
        };
        console.log("Dados do cliente atualizados: ", updatedData);
        return updatedData;
      }
      return prevData;
    });
  };

  const updateClientData = async () => {
    if (id && clientData) {
      try {
        const updatedData = Object.fromEntries(
          Object.entries(clientData).filter(
            ([, value]) => value !== "" && value !== null && value !== undefined
          )
        );

        if (Object.keys(updatedData).length) {
          const docRef = doc(db, "vendas", id);
          await setDoc(docRef, updatedData, { merge: true });
          navigate("/monitoria");
        } else {
          console.error("Nenhum campo válido para atualizar.");
        }
      } catch (error) {
        console.error("Erro ao atualizar os dados do cliente: ", error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateClientData();
  };

  return (
    <div className="ficha-monitoria">
      <form onSubmit={handleSubmit}>
        {clientData && step === 0 && (
          <FichaMonitoriaQualidade
            form={clientData}
            handleInputChange={handleInputChange}
          />
        )}
        {clientData && step === 1 && (
          <FichaMonitoriaAuditoria
            form={clientData}
            handleInputChange={handleInputChange}
          />
        )}
        {clientData && step === 2 && (
          <FichaMonitoriaGrave
            form={clientData}
            handleInputChange={handleInputChange}
          />
        )}
        {clientData && step === 3 && (
          <FichaMonitoriaConfirmacao
            form={clientData}
            handleInputChange={handleInputChange}
          />
        )}
        <div className="mt-4 d-flex gap-4 justify-content-center">
          {step === 0 && (
            <button type="button" className="btn btn-danger" onClick={() => window.history.back()}>
              Sair
            </button>
          )}
          {step > 0 && (
            <button type="button" className="btn btn-secondary" onClick={() => setStep(step - 1)}>
              Voltar
            </button>
          )}
          {step < 3 && (
            <button type="button" className="btn btn-primary" onClick={() => setStep(step + 1)}>
              Próximo
            </button>
          )}
          {step <= 3 && (
            <button type="submit" className="btn btn-success">
              Salvar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
