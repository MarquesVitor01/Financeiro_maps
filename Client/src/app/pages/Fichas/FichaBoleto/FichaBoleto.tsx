import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { toast } from 'react-toastify';
import './Styles/FichaBoleto.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';

interface BoletoData {
  barcode: string;
  billetLink: string;
  expireAt: string;
  pdfLink: string;
  status: string;
}

export const FichaBoleto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [clientData, setClientData] = useState<any>(null);
  const [boletoDataList, setBoletoDataList] = useState<BoletoData[]>([]);  // Alterado para lista de boletos
  const [loading, setLoading] = useState(true);
  const [generatingBoleto, setGeneratingBoleto] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (id) {
          const docRef = doc(db, 'vendas', id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setClientData(data);
            
            if (data.boleto && Array.isArray(data.boleto)) {
              setBoletoDataList(data.boleto);
            }
          } else {
            console.error('Cliente não encontrado.');
          }
        }
      } catch (error) {
        console.error('Erro ao buscar os dados do cliente:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id]);

  const generateBoleto = async () => {
    setGeneratingBoleto(true);
    try {
      if (clientData && clientData.parcelas) {
        const boletosGerados: BoletoData[] = [];
        for (let i = 0; i < clientData.parcelas; i++) {
          // homologação
          const accessToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MzEzMjk5NDIsImV4cCI6MTczMTMzMDU0MiwiZGF0YSI6eyJrZXlfaWQiOjIwNjM0NzgsInR5cGUiOiJhY2Nlc3NUb2tlbiIsImlkIjoiNjE0OGI4MzItYzhiNy00NGU0LWJjY2YtYjVlMDczMWZlZmMyKzE5ZWIwZTYxLTNmYjUtNDdkMS1hZWM3LTZmZjUyZDM4YTY0ZSJ9fQ.xyQ9ulIdxcvOcXGJ-vPcV5o782Nc3YpSNU0HLb5_ZTo';
          
          // produção
          // const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MzE2MDYzMzYsImV4cCI6MTczMTYwNjkzNiwiZGF0YSI6eyJrZXlfaWQiOjIwNjM0NzksInR5cGUiOiJhY2Nlc3NUb2tlbiIsImlkIjoiN2M4N2M2ZmItMzZjNS00MDRiLWFiNDgtY2RkYTFlY2IwZTgwKzcwMDYzOWE3LTA2ZjktNDhiMS04YmJjLTdiZmIzNWNhMGNmZCJ9fQ.BlwMStEr4TP5rY8DDb8jBfPZQvlM0yXzvenLs0CwA8Q"

          const response = await fetch('http://localhost:5000/generate-boleto', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              name: clientData.responsavel,
              email: clientData.email1,
              cpf: clientData.cpf,
              birth: '1977-01-15',
              phone_number: clientData.celular,
              items: [
                {
                  name: clientData.validade,
                  value: Number(clientData.valorVenda),
                  amount: 1,
                },
              ],
              shippingValue: 100,
            }),
          });

          if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
          }

          const result = await response.json();

          if (
            !result.data ||
            !result.data.barcode ||
            !result.data.billet_link ||
            !result.data.pdf ||
            !result.data.pdf.charge
          ) {
            throw new Error('Resposta da API não contém informações completas do boleto.');
          }

          const boleto: BoletoData = {
            barcode: result.data.barcode,
            billetLink: result.data.billet_link,
            expireAt: result.data.expire_at,
            pdfLink: result.data.pdf.charge,
            status: result.data.status,
          };

          const vencimento = new Date(boleto.expireAt);
          vencimento.setMonth(vencimento.getMonth() + i);  

          boleto.expireAt = vencimento.toLocaleDateString('pt-BR');

          boletosGerados.push(boleto);
        }

        const docRef = doc(db, 'vendas', id!);
        await updateDoc(docRef, { boleto: boletosGerados });

        setBoletoDataList(boletosGerados); 
        toast.success('Boletos gerados com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao gerar boletos:', error);
      toast.error('Erro ao gerar os boletos.');
    } finally {
      setGeneratingBoleto(false); 
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  const sairFicha = () => {
    window.history.back();
  };

  return (
    clientData && (
      <div className="fichaBoleto">
        <div className="container">
          <button className="btn btn-danger btn-sair-marketing" onClick={sairFicha}>
            <FontAwesomeIcon icon={faLeftLong} />
          </button>
          {boletoDataList.length === 0 && (
            <div className="flex-column justify-content-center d-flex align-items-center gap-3 box-boleto">
              <h2 className="text-center">Clique no botão abaixo para gerar os boletos.</h2>
              <button
                className="btn btn-primary"
                onClick={generateBoleto}
                disabled={generatingBoleto}
              >
                {generatingBoleto ? 'Gerando Boletos...' : 'Gerar Boletos'}
              </button>
            </div>
          )}
          {boletoDataList.length > 0 && (
            <div className="mt-4">
              <h3 className="text-center text-light">Boletos Gerados</h3>
              <div className="boletos-container">
                {boletoDataList.map((boleto, index) => (
                  <div key={index} className="card mb-4 p-4 boleto-card">
                    <p><strong>Código de barra:</strong> {boleto.barcode}</p>
                    <p><strong>Link do boleto:</strong> <a href={boleto.billetLink}>{boleto.billetLink}</a></p>
                    <p><strong>Data de expiração:</strong> {boleto.expireAt}</p>
                    <p><strong>Link para download do PDF:</strong> <a href={boleto.pdfLink}>{boleto.pdfLink}</a></p>
                    <p><strong>Status:</strong> {boleto.status}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
};
