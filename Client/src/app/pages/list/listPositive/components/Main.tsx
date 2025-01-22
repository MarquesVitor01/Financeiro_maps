import React, { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import '../ListPositive.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong, faRightLong } from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig"; // Certifique-se de que o caminho esteja correto

export const Main = () => {
  const [saidas, setSaidas] = useState<any[]>([]); // Tipo qualquer para dados
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(0);

  // Buscar dados negativos do Firebase
  const fetchPositivoData = async () => {
    try {
      const q = query(collection(db, "registros"), where("tipo", "==", "positivo"));
      const querySnapshot = await getDocs(q);
      const registros: any[] = [];
      querySnapshot.forEach((doc) => {
        registros.push(doc.data());
      });
      setSaidas(registros); // Atualiza o estado com os dados encontrados
    } catch (error) {
      console.error("Erro ao buscar dados positivos:", error);
    }
  };

  useEffect(() => {
    fetchPositivoData(); // Carregar os dados quando o componente for montado
  }, []);

  const paginatedSaidas = saidas.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < saidas.length) {
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
            <h4 className="text-start">Lista de Receitas</h4>
            <button className="btn btn-warning">Filtros</button>
          </div>
          <div className="box-list">
            <table className="custom-table">
              <thead>
                <tr>
                  <th className="table-header">Ícone</th>
                  <th className="table-header">Valor</th>
                  <th className="table-header">Data</th>
                  <th className="table-header">Atividade</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSaidas.map((saida, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-cell">📉</td>
                    <td className="table-cell">{saida.valor}</td>
                    <td className="table-cell">{new Date(saida.data).toLocaleDateString('pt-BR')}</td>
                    <td className="table-cell">{saida.categoria}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="pagination">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className={`pagination-btn ${currentPage === 0 ? "disabled" : ""}`}
        >
          <FontAwesomeIcon icon={faLeftLong} />
        </button>
        <button
          onClick={handleNextPage}
          disabled={(currentPage + 1) * itemsPerPage >= saidas.length}
          className={`pagination-btn ${ (currentPage + 1) * itemsPerPage >= saidas.length ? "disabled" : "" }`}
        >
          <FontAwesomeIcon icon={faRightLong} />
        </button>
      </div>
    </div>
  );
};
