import React from 'react';
import { useAuth } from '../../../../context/AuthContext';

interface HeaderDashProps {
  totalFinanceiros: number;
  totalPagos: number; 
  totalNegativados: number; 
  totalCancelados: number;
}

export const HeaderDash: React.FC<HeaderDashProps> = ({ totalFinanceiros, totalPagos, totalNegativados, totalCancelados }) => {
  const { nome } = useAuth(); 
  return (
    <>
      <section>
        <div className="">
          <div className="header-dash">
            <div className="row">
              <div className="col-md-6 bemvindo-text">
                <h3>Olá, {nome}</h3>
              </div>

              <div className="header-info">
                <div className="col-md-3 info-item">
                  <h3>Total de Clientes</h3>
                  <p>{totalFinanceiros}</p> 
                </div>
                <div className="col-md-3 info-item">
                  <h3>Total Pagos</h3>
                  <p>{totalPagos}</p>
                </div>
                <div className="col-md-3 info-item">
                  <h3>Total Cancelados</h3>
                  <p>{totalCancelados}</p>
                </div>
                <div className="col-md-3 info-item">
                  <h3>Total Negativados</h3>
                  <p>{totalNegativados}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
