import React, { useState } from "react";
import { Operador } from "./Components/Operador";
import { DadosEmpresa } from "./Components/Empresa";
import { Navigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import { runTransaction, doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Components/Styles/add.css";
import { useAuth } from "../../context/AuthContext";
import { InfoAdicionais } from "./Components/InfoAdicionais";

export const Add = () => {
  const userId = auth.currentUser?.uid;
  const { nome, cargo } = useAuth();
  const [form, setForm] = useState({
    numeroContrato: "",
    data: "",
    dataVencimento: "",
    operador: nome,
    createdBy: userId,
    setor: cargo,
    equipe: "G MARKETING DIGITAL",
    account: "equipe_marcio",
    razaoSocial: "",
    cpf: "",
    cnpj: "",
    nomeFantasia: "",
    enderecoComercial: "",
    bairro: "",
    cep: "",
    estado: "",
    cidade: "",
    validade: "",
    observacoes: "",
    fixo: "",
    celular: "",
    whatsapp: "",
    email1: "",
    email2: "",
    horarioFuncionamento: "",
    responsavel: "",
    cargo: "",
    valorVenda: "",
    contrato: "",
    parcelas: "1",
    formaPagamento: "",
    qrcodeText: "",
    renovacaoAutomatica: "",
    linkGoogle: "",
    criacao: "",
    ctdigital: "",
    logotipo: "",
    anuncio: "",
  });

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tipoDocumento, setTipoDocumento] = useState("CPF");
  const [redirect, setRedirect] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "email1" || name === "email2") {
      const emailWithoutSpaces = value.replace(/\s+/g, "");
      setForm((prev) => ({
        ...prev,
        [name]: emailWithoutSpaces,
      }));
    }
    else if (name === "celular" || name === "whatsapp") {
      const numericValue = value.replace(/\D/g, "");

      if (numericValue.length <= 11) {
        setForm((prev) => ({
          ...prev,
          [name]: numericValue,
        }));
      }
    }
    else if (name === "fixo") {
      const numericValue = value.replace(/\D/g, "");

      if (numericValue.length <= 10) {
        setForm((prev) => ({
          ...prev,
          [name]: numericValue,
        }));
      }
    }
    else if ((name === "cnpj" || name === "cpf") && value.length >= 6) {
      setForm((prev) => ({
        ...prev,
        [name]: value,
        numeroContrato: value.slice(0, 6),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const handleSelectChange = (selectedOption: any) => {
    setForm({ ...form, operador: selectedOption.value });
  };

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const sairFicha = () => {
    window.history.back();
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const clienteRef = doc(db, "vendas", form.numeroContrato);

      await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(clienteRef);
        if (docSnap.exists()) {
          transaction.update(clienteRef, { ...form });
        } else {
          transaction.set(clienteRef, form);
        }
      });

      toast.success("Cliente salvo com sucesso!");
      setRedirect(true);
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
    } finally {
      setLoading(false);
    }
  };



  if (redirect) {
    return <Navigate to={"/vendas"} />;
  }

  return (
    <div className="contrato text-center">
      {loading && <p>Aguarde, estamos processando...</p>}
      <div className="container">
        <h2 className="title-contrato">Adicionar Informações do Cliente</h2>
        <form onSubmit={handleSubmit}>
          {step === 0 && (
            <Operador
              form={form}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              operadoresOpcoes={[]}
            />
          )}
          {step === 1 && (
            <DadosEmpresa
              form={form}
              handleInputChange={handleInputChange}
              tipoDocumento={tipoDocumento}
            />
          )}
          {step === 2 && (
            <InfoAdicionais form={form} handleInputChange={handleInputChange} />
          )}

          <div className="mt-4">
            {step >= 0 && (
              <button
                type="button"
                className="btn btn-danger me-2"
                onClick={sairFicha}
              >
                Sair
              </button>
            )}
            {step > 0 && (
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={handleBack}
              >
                Voltar
              </button>
            )}

            {step < 2 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
              >
                Próximo
              </button>
            )}
            {step === 2 && (
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar"}
              </button>
            )}
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};
