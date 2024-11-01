import React, { useEffect, useState } from "react";
import { EditOperador } from "./Components/EditOperador";
import { EditEmpresa } from "./Components/EditEmpresa";
import { EditInfoAdicionais } from "./Components/EditInfoAdicionais";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import "../Add/Components/Styles/add.css";

interface ClientData {
  numeroContrato: string;
  valorVenda: string;
  validade: string;
  formaPagamento: string;
  data: string;
  operador: string;
  equipe: string;
  contrato: string;
  razaoSocial: string;
  cpf: string;
  cnpj: string;
  nomeFantasia: string;
  enderecoComercial: string;
  bairro: string;
  cep: string;
  estado: string;
  cidade: string;
  observacoes: string;
  fixo: string;
  celular: string;
  whatsapp: string;
  email1: string;
  email2: string;
  horarioFuncionamento: string;
  responsavel: string;
  cargo: string;
  parcelas: string;
  dataVencimento: string;
  qrcodeText: string;
  linkGoogle: string;
}

export const EditContrato = () => {
  const { id } = useParams<{ id: string }>();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [tipoDocumento, setTipoDocumento] = useState<"CPF" | "CNPJ">("CPF");
  const [isRotated, setIsRotated] = useState(false);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientData = async () => {
      if (id) {
        try {
          const docRef = doc(db, "vendas", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setClientData(docSnap.data() as ClientData);
          } else {
            toast.error("Documento não encontrado");
          }
        } catch (error) {
          console.error("Erro ao buscar os dados do cliente: ", error);
          toast.error("Erro ao buscar dados do cliente.");
        }
      }
    };
    fetchClientData();
  }, [id]);

  const handleToggleDocumento = () => {
    setTipoDocumento((prev) => (prev === "CPF" ? "CNPJ" : "CPF"));
    setIsRotated((prev) => !prev);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setClientData((prevData) =>
      prevData
        ? {
            ...prevData,
            [name]: value,
            ...(name === "cpf" || name === "cnpj"
              ? { numeroContrato: value.slice(0, 6) }
              : {}),
          }
        : prevData
    );
  };

  const handleNext = () => setStep((prevStep) => prevStep + 1);
  const handleBack = () => setStep((prevStep) => prevStep - 1);

  const sairFicha = () => window.history.back();

  const updateClientData = async () => {
    if (id && clientData) {
      try {
        const updatedData = Object.fromEntries(
          Object.entries(clientData).filter(
            ([_, value]) => value !== "" && value !== null && value !== undefined
          )
        );

        if (Object.keys(updatedData).length === 0) {
          console.error("Nenhum campo válido para atualizar.");
          return;
        }

        await setDoc(doc(db, "vendas", id), updatedData, { merge: true });
        toast.success("Dados do cliente atualizados com sucesso!"); 
        setTimeout(() => navigate(-1), 2000); 
      } catch (error) {
        console.error("Erro ao atualizar os dados do cliente: ", error);
        toast.error("Erro ao atualizar os dados do cliente."); 
      }
    } else {
      console.log("ID ou clientData não disponível.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateClientData();
  };
  
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <EditOperador form={clientData} handleInputChange={handleInputChange} />
        );
      case 1:
        return (
          <EditEmpresa
            form={clientData}
            handleInputChange={handleInputChange}
            tipoDocumento={tipoDocumento}
            handleToggleDocumento={handleToggleDocumento}
            isRotated={isRotated}
          />
        );
      case 2:
        return (
          <EditInfoAdicionais form={clientData} handleInputChange={handleInputChange} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="contrato text-center">
      <div className="container">
        <h2 className="title-contrato">Editar Informações do Cliente</h2>
        <form onSubmit={handleSubmit}>
          {renderStep()}
          <div className="mt-4 d-flex gap-4 justify-content-center">
            {step === 0 && (
              <button type="button" className="btn btn-danger" onClick={sairFicha}>
                Sair
              </button>
            )}
            {step > 0 && (
              <button type="button" className="btn btn-secondary" onClick={handleBack}>
                Voltar
              </button>
            )}
            {step < 2 && (
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                Próximo
              </button>
            )}
            <button type="submit" className="btn btn-success btn-salvar">
              Salvar
            </button>
          </div>
        </form>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </div>
  );
};
