import React, { useState } from "react";
import "react-calendar/dist/Calendar.css";

export const Main = () => {
  const entradas = [
    { valor: 500, data: "12/01/2025", icon: "📈", atividade: "salario" },
    { valor: 200, data: "11/01/2025", icon: "📈", atividade: "vt" },
    { valor: 300, data: "10/01/2025", icon: "📈", atividade: "vr" },
    { valor: 300, data: "10/01/2025", icon: "📈", atividade: "vr" },
    { valor: 300, data: "10/01/2025", icon: "📈", atividade: "vr" },
    { valor: 300, data: "10/01/2025", icon: "📈", atividade: "vr" },
    { valor: 300, data: "10/01/2025", icon: "📈", atividade: "vr" },
    { valor: 300, data: "10/01/2025", icon: "📈", atividade: "vr" },
    { valor: 300, data: "10/01/2025", icon: "📈", atividade: "vr" },
    { valor: 400, data: "09/01/2025", icon: "📉", atividade: "salario" },
    { valor: 600, data: "08/01/2025", icon: "📈", atividade: "vt" },
  ];

  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(0);

  const paginatedEntradas = entradas.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < entradas.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="list">
      <div className="list-box mt-5">
        <div className="content-list">
          <div className="header-list">
            <h4 className="text-start">Lista de Entrada</h4>
            <button className="btn btn-warning">Filtros</button>
          </div>
          <div className="box-list">
            <table
              style={{
                width: "100%",
                color: "#fff",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th style={{ padding: "10px", textAlign: "left" }}>Ícone</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Valor</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Data</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>
                    Atividade
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedEntradas.map((entrada, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <td style={{ padding: "10px" }}>{entrada.icon}</td>
                    <td style={{ padding: "10px" }}>{entrada.valor}</td>
                    <td style={{ padding: "10px" }}>{entrada.data}</td>
                    <td style={{ padding: "10px" }}>{entrada.atividade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "10px",
          left: "26%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "15px",
        }}
      >
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          style={{
            backgroundColor: "#1d6f62",
            color: "#fff",
            border: "none",
            padding: "10px 15px",
            cursor: currentPage === 0 ? "not-allowed" : "pointer",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          {"< Anterior"}
        </button>
        <button
          onClick={handleNextPage}
          disabled={(currentPage + 1) * itemsPerPage >= entradas.length}
          style={{
            backgroundColor: "#1d6f62",
            color: "#fff",
            border: "none",
            padding: "10px 15px",
            cursor:
              (currentPage + 1) * itemsPerPage >= entradas.length
                ? "not-allowed"
                : "pointer",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          {"Próximo >"}
        </button>
      </div>
    </div>
  );
};
