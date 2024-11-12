import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MarketingForm } from './Components/MarketingForm';
import './Styles/FichaMarketing.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

export const FichaMarketing: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (id) {
          const docRef = doc(db, "marketings", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setClientData(docSnap.data());
          } else {
            console.log("Não encontrado");
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

  const handleMarketingSubmit = async (data: any) => {
    try {
      if (id) {
        const docRef = doc(db, "marketings", id);
        await updateDoc(docRef, data);
        setClientData(data);
        console.log("Dados atualizados com sucesso!");
        navigate("/marketing")
      }
    } catch (error) {
      console.error("Erro ao atualizar os dados de marketing: ", error);
    }
  };

  const sairFicha = () => {
    window.history.back();
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    clientData && (
      <div className="fichaMarketing">
        <div className="container">
          <button className="btn btn-danger btn-sair-marketing" onClick={sairFicha}>
            <FontAwesomeIcon icon={faLeftLong} />
          </button>
          <div className="row">
            <div className="col-md-6">
              <div className="card mb-4 p-4">
                <h2 className="text-center">Informações do Cliente</h2>
                <p><strong>CNPJ:</strong> {clientData.cnpj || clientData.cnpj}</p>
                <p><strong>Razão Social:</strong> {clientData.razaoSocial}</p>
                <p><strong>Nome Fantasia:</strong> {clientData.nomeFantasia}</p>
                <p><strong>Operador:</strong> {clientData.operador}</p>
                <p><strong>Telefone:</strong> {clientData.telefone || clientData.celular}</p>
                <p><strong>Whatsapp:</strong> {clientData.whatsapp}</p>
                <p><strong>Valor da Venda:</strong> {clientData.valorVenda}</p>
                <p><strong>Vencimento:</strong> {clientData.dataVencimento}</p>
                <p><strong>Observações:</strong> {clientData.observacoes}</p>
              </div>
            </div>
            <div className="col-md-6">
              <MarketingForm form={clientData} onSubmit={handleMarketingSubmit} />
            </div>
            
          </div>
        </div>
      </div>
    )
  );
};
