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
  const [boletoData, setBoletoData] = useState<BoletoData | null>(null);
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
            if (data.boleto) {
              setBoletoData({
                barcode: data.boleto.barcode || 'Não disponível',
                billetLink: data.boleto.billetLink || '#',
                expireAt: data.boleto.expireAt || 'Não disponível',
                pdfLink: data.boleto.pdfLink || '#',
                status: data.boleto.status || 'Não disponível',
              });
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
    setGeneratingBoleto(true); // Inicia o estado de carregamento
    try {
      const accessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MzEzMjk5NDIsImV4cCI6MTczMTMzMDU0MiwiZGF0YSI6eyJrZXlfaWQiOjIwNjM0NzgsInR5cGUiOiJhY2Nlc3NUb2tlbiIsImlkIjoiNjE0OGI4MzItYzhiNy00NGU0LWJjY2YtYjVlMDczMWZlZmMyKzE5ZWIwZTYxLTNmYjUtNDdkMS1hZWM3LTZmZjUyZDM4YTY0ZSJ9fQ.xyQ9ulIdxcvOcXGJ-vPcV5o782Nc3YpSNU0HLb5_ZTo';
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
      console.log('Resposta da API:', result);

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

      const docRef = doc(db, 'vendas', id!);
      await updateDoc(docRef, { boleto });

      setBoletoData(boleto);
      toast.success('Boleto gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar boleto:', error);
      toast.error('Erro ao gerar o boleto.');
    } finally {
      setGeneratingBoleto(false); // Finaliza o estado de carregamento
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
      <div className="fichaMarketing">
        <div className="container">
          <button className="btn btn-danger btn-sair-marketing" onClick={sairFicha}>
            <FontAwesomeIcon icon={faLeftLong} />
          </button>
          {!boletoData ? (
            <div className='flex-column justify-content-center d-flex align-items-center gap-3 box-boleto'>
            <div>
            <h2 className="text-center">Clique no botão a baixo para gerar o boleto.</h2>
            </div>
              <div>
              <button className="btn btn-primary" onClick={generateBoleto} disabled={generatingBoleto}>
                {generatingBoleto ? 'Gerando Boleto...' : 'Gerar Boleto'}
              </button>
              </div>

            </div>
          ) : (
            <div className="row">
              <div className="col-md-12">
                <div className="card mb-4 p-4">
                  <h2 className="text-center">Informações do Boleto</h2>
                  <p><strong>Código de barra:</strong> {boletoData.barcode}</p>
                  <p><strong>Link do boleto:</strong> <a href={boletoData.billetLink}>{boletoData.billetLink}</a></p>
                  <p><strong>Data de expiração:</strong> {boletoData.expireAt}</p>
                  <p><strong>Link para download do PDF:</strong> <a href={boletoData.pdfLink}>{boletoData.pdfLink}</a></p>
                  <p><strong>Status:</strong> {boletoData.status}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
};
