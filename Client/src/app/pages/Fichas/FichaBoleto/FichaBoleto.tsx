import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/FichaBoleto.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

export const FichaBoleto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id]);


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
            <div className="col-md-12">
              <div className="card mb-4 p-4">
                <h2 className="text-center">Informações do Boleto</h2>
                <p><strong>Código de barra:</strong> {clientData.boleto.data.barcode}</p>
                <p><strong>Link do boleto:</strong> <a href={clientData.boleto.data.billet_link}>{clientData.boleto.data.billet_link}</a></p>
                <p><strong>Data de expiração:</strong> {clientData.boleto.data.expire_at}</p>
                <p><strong>Link para download:</strong> <a href={clientData.boleto.data.link}>{clientData.boleto.data.link}</a></p>
                <p><strong>Link para download do PDF:</strong> <a href={clientData.boleto.data.pdf.charge}>{clientData.boleto.data.pdf.charge}</a></p>
                <p><strong>Status:</strong> {clientData.boleto.data.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
