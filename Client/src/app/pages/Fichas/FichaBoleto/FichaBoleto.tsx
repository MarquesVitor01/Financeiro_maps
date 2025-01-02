import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Styles/FichaBoleto.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";

interface BoletoData {
  barcode: string;
  billetLink: string;
  expireAt: string;
  pdfLink: string;
  status: string;
  chargeId: string;
}

export const FichaBoleto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [clientData, setClientData] = useState<any>(null);
  const [boletoDataList, setBoletoDataList] = useState<BoletoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingBoleto, setGeneratingBoleto] = useState(false);

  const fetchClientData = useCallback(async () => {
    if (!id) return;

    try {
      const docRef = doc(db, "vendas", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setClientData(data);
        setBoletoDataList(Array.isArray(data.boleto) ? data.boleto : []);
      } else {
        console.error("Cliente não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar os dados do cliente:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClientData();
  }, [fetchClientData]);

  const generateBoletos = async (url: string, isCpf: boolean) => {
    setGeneratingBoleto(true);
  
    try {
      if (!clientData || !clientData.parcelas) return;
  
      const boletosGerados: BoletoData[] = [];
      const vencimentoBase = new Date(clientData.dataVencimento); // Certifique-se que dataVencimento existe e está correta
  
      for (let i = 0; i < clientData.parcelas; i++) {
        const vencimento = new Date(vencimentoBase);
        vencimento.setMonth(vencimento.getMonth() + i);
  
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer <ACCESS_TOKEN>`,
          },
          body: JSON.stringify({
            ...(isCpf
              ? {
                  name: clientData.responsavel,
                  cpf: clientData.cpf,
                  birth: "1977-01-15",
                }
              : {
                  juridical_person: {
                    corporate_name: clientData.razaoSocial,
                    cnpj: clientData.cnpj,
                  },
                }),
            email: clientData.email1,
            phone_number: clientData.celular,
            items: [
              {
                name: clientData.validade,
                value: Number(clientData.parcelas === 1 ? clientData.valorVenda : clientData.valorParcelado),
                amount: 1,
              },
            ],
            // shippingValue: 100,
            account: "equipe_marcio",
            dataVencimento: vencimento.toISOString().split("T")[0], // Incluindo a data de vencimento na requisição
          }),
        });
  
        if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
  
        const result = await response.json();
        const { data } = result;
  
        if (
          !data?.barcode ||
          !data?.billet_link ||
          !data?.pdf?.charge ||
          !data?.expire_at
        ) {
          throw new Error("Resposta da API incompleta.");
        }
  
        boletosGerados.push({
          barcode: data.barcode,
          billetLink: data.billet_link,
          expireAt: vencimento.toISOString(),
          pdfLink: data.pdf.charge,
          status: data.status,
          chargeId: data.charge_id,
        });
      }
  
      const docRef = doc(db, "vendas", id!);
      await updateDoc(docRef, { boleto: boletosGerados });
  
      setBoletoDataList(boletosGerados);
      toast.success("Boletos gerados com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar boletos:", error);
      toast.error("Erro ao gerar os boletos.");
    } finally {
      setGeneratingBoleto(false);
    }
  };  

  const fetchBoletoDetails = async (chargeId: string) => {
    try {
      if (!chargeId || !clientData?.account) {
        throw new Error("ID do boleto ou conta não fornecidos.");
      }

      // Requisição para buscar os detalhes do boleto
      const response = await fetch(
        `http://localhost:5000/v1/charge/${chargeId}?account=${clientData.account}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer <ACCESS_TOKEN>`,
          },
        }
      );

      if (!response.ok)
        throw new Error("Erro ao buscar informações do boleto.");

      const boletoDetails = await response.json();
      console.log("Detalhes do boleto:", boletoDetails);

      const updatedBoletos = boletoDataList.map((boleto) =>
        boleto.chargeId === chargeId
          ? { ...boleto, status: boletoDetails.status }
          : boleto
      );

      setBoletoDataList(updatedBoletos);
      const docRef = doc(db, "vendas", id!);
      await updateDoc(docRef, {
        boleto: updatedBoletos,
      });

      toast.success("Informações do boleto carregadas e status atualizado!");
    } catch (error: any) {
      console.error("Erro ao buscar informações do boleto:", error.message);
      toast.error(error.message || "Erro ao buscar as informações do boleto.");
    }
  };

  if (loading) return <p>Carregando...</p>;

  const sairFicha = () => window.history.back();

  return (
    clientData && (
      <div className="fichaBoleto">
        <div className="container flex-column d-flex">
          <button
            className="btn btn-danger btn-sair-marketing"
            onClick={sairFicha}
          >
            <FontAwesomeIcon icon={faLeftLong} />
          </button>
          {boletoDataList.length === 0 ? (
            <>
              <div className="row align-center justify-content-center text-center text-white">
                <div className="text-cpf">
                  <p>
                    <b>O cliente possui o CPF:</b>{" "}
                    {clientData.cpf || "Não informado"}
                  </p>
                </div>
                <div className="text-cnpj">
                  <p>
                    <b>O cliente possui o CNPJ:</b>{" "}
                    {clientData.cnpj || "Não informado"}
                  </p>
                </div>
              </div>
              <div className="d-flex gap-5">
                {["CPF", "CNPJ"].map((type, idx) => (
                  <div
                    key={type}
                    className="flex-column justify-content-center d-flex align-items-center gap-3 box-boleto"
                  >
                    <h2 className="text-center">
                      Clique no botão abaixo para gerar os boletos com {type}.
                    </h2>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        generateBoletos(
                          `http://localhost:5000/generate-boleto-${type.toLowerCase()}`,
                          idx === 0
                        )
                      }
                      disabled={generatingBoleto}
                    >
                      {generatingBoleto
                        ? "Gerando Boletos..."
                        : `Gerar Boletos com ${type}`}
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-4">
              <h3 className="text-center text-light">Boletos Gerados</h3>
              <div className="boletos-container">
                {boletoDataList.map((boleto) => (
                  <div
                    key={boleto.chargeId}
                    className="card mb-4 p-4 boleto-card"
                  >
                    {" "}
                    <p>
                      <strong>Código de barra:</strong> {boleto.barcode}
                    </p>
                    <p>
                      <strong>Link do boleto:</strong>{" "}
                      <a href={boleto.billetLink}>{boleto.billetLink}</a>
                    </p>
                    <p>
                      <strong>Data de expiração:</strong> {boleto.expireAt}
                    </p>
                    <p>
                      <strong>Link para download do PDF:</strong>{" "}
                      <a href={boleto.pdfLink}>{boleto.pdfLink}</a>
                    </p>
                    <p>
                      <strong>Status:</strong> {boleto.status}
                    </p>
                    <p>
                      <strong>Charge_id:</strong> {boleto.chargeId}
                    </p>
                    <button
                      onClick={() => fetchBoletoDetails(boleto.chargeId)}
                      className="btn btn-info"
                    >
                      Verificar Status do Boleto
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    )
  );
};
