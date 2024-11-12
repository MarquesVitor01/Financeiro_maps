import React, { useState } from "react";
import { Operador } from "./Components/Operador";
import { DadosEmpresa } from "./Components/Empresa";
import { Navigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import {runTransaction, doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Components/Styles/add.css";
import { useAuth } from "../../context/AuthContext";
import { InfoAdicionais } from "./Components/InfoAdicionais";

interface BoletoData {
  pdfLink: string;
  billetLink: string;
  barcode: string;
}

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
    valorVenda: 0,
    contrato: "",
    parcelas: "1",
    formaPagamento: "",
    qrcodeText: "",
    renovacaoAutomatica: "",
    linkGoogle: "",
    opcao1: false,
    opcao2: false,
    opcao3: false,
    opcao4: false,
  });

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tipoDocumento, setTipoDocumento] = useState("CPF");
  const [isRotated, setIsRotated] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if ((name === "cnpj" || name === "cpf") && value.length >= 6) {
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

  const handleToggleDocumento = () => {
    setTipoDocumento((prev) => (prev === "CPF" ? "CNPJ" : "CPF"));
    setIsRotated((prev) => !prev);
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

  const [boletoData, setBoletoData] = useState<BoletoData | null>(null);

  const generateBoleto = async () => {
    try {
      const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MzEzMjk5NDIsImV4cCI6MTczMTMzMDU0MiwiZGF0YSI6eyJrZXlfaWQiOjIwNjM0NzgsInR5cGUiOiJhY2Nlc3NUb2tlbiIsImlkIjoiNjE0OGI4MzItYzhiNy00NGU0LWJjY2YtYjVlMDczMWZlZmMyKzE5ZWIwZTYxLTNmYjUtNDdkMS1hZWM3LTZmZjUyZDM4YTY0ZSJ9fQ.xyQ9ulIdxcvOcXGJ-vPcV5o782Nc3YpSNU0HLb5_ZTo";
      const response = await fetch("http://localhost:5000/generate-boleto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: form.responsavel,
          email: form.email1,
          cpf: form.cpf,
          birth: "1977-01-15",
          phone_number: form.celular,
          items: [
            {
              name: form.validade,
              value: Number(form.valorVenda),
              amount: 1,
            },
          ],
          shippingValue: 100,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      setBoletoData({
        pdfLink: data.pdfLink,
        billetLink: data.billetLink,
        barcode: data.barcode,
      });
      return data;
    } catch (error) {
      console.error("Erro ao gerar boleto:", error);
      toast.error("Erro ao gerar o boleto.");
      return null;
    }
  };

  const saveBoletoData = async (boletoData: BoletoData) => {
    try {
      const clienteRef = doc(db, "vendas", form.numeroContrato);
      await updateDoc(clienteRef, { boleto: boletoData });
      toast.success("Boleto salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar boleto no Firebase:", error);
      toast.error("Erro ao salvar boleto.");
    }
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
      const boletoResponse = await generateBoleto();
      if (boletoResponse) {
        await saveBoletoData(boletoResponse);
      }
      console.log(boletoResponse);
      console.log(boletoData);
      

      setRedirect(true);
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      toast.error("Erro ao salvar cliente ou gerar boleto.");
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
              // handleToggleDocumento={handleToggleDocumento}
              // isRotated={isRotated}
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
                disabled={loading} // Botão desativado enquanto `loading` for true
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
