import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faEye,
  faSearch,
  faFilter,
  faTableList,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { ModalExcel } from "./modalExcel";
import { db } from "../../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

interface Financeiro {
  id: string;
  cnpj: string;
  cpf: string;
  responsavel: string;
  email1: string;
  email2: string;
  operador: string;
  data: string;
  dataVencimento: string;
  contrato: string;
  nomeMonitor: string;
  operadorSelecionado: { value: string; label: string } | null;
  monitoriaConcluidaYes: boolean;
  servicosConcluidos: boolean;
  encaminharCliente: string;
}

interface ListDashboardProps {
  setTotalFinanceiros: (total: number) => void;
}

export const ListDashboard: React.FC<ListDashboardProps> = ({ setTotalFinanceiros }) => {
  const [financeiros, setFinanceiros] = useState<Financeiro[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modalExcel, setModalExcel] = useState(false);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    dueDate: "",
    saleType: "",
    salesPerson: "",
    cobPerson: ""
  });

  useEffect(() => {
    const fetchFinanceiros = async () => {
      setLoading(true);
      try {
        const financeirosCollection = collection(db, "financeiros");
        const financeirosSnapshot = await getDocs(financeirosCollection);
        const financeirosList = financeirosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Financeiro[];

        setFinanceiros(financeirosList);
        // Define o total de clientes que têm encaminharCliente igual a "sim"
        const totalFinanceiros = financeirosList.filter(financeiro => financeiro.encaminharCliente === "sim").length;
        setTotalFinanceiros(totalFinanceiros); 
      } catch (error) {
        console.error("Erro ao buscar financeiros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceiros();
  }, [setTotalFinanceiros]);

  const handleCheckboxChange = (id: string) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = new Set(prevSelectedItems);
      if (newSelectedItems.has(id)) {
        newSelectedItems.delete(id);
      } else {
        newSelectedItems.add(id);
      }
      return newSelectedItems;
    });
  };

  const applyFilters = () => {
    let filteredClients = financeiros.filter((financeiro) => {
      const lowerCaseTerm = searchTerm.toLowerCase();
      const matchesSearchTerm =
        (financeiro.cnpj && financeiro.cnpj.toLowerCase().includes(lowerCaseTerm)) ||
        (financeiro.cpf && financeiro.cpf.toLowerCase().includes(lowerCaseTerm)) ||
        (financeiro.responsavel && financeiro.responsavel.toLowerCase().includes(lowerCaseTerm)) ||
        (financeiro.email1 && financeiro.email1.toLowerCase().includes(lowerCaseTerm)) ||
        (financeiro.email2 && financeiro.email2.toLowerCase().includes(lowerCaseTerm)) ||
        (financeiro.operador && financeiro.operador.toLowerCase().includes(lowerCaseTerm));
  
      const { startDate, endDate, dueDate, saleType, salesPerson, cobPerson } = filters;
  
      const financeiroData = new Date(financeiro.data);
      const isStartDateValid = startDate ? financeiroData.toDateString() === new Date(startDate).toDateString() : true;
  
      const isDateInRange = (startDate && endDate)
        ? financeiroData >= new Date(startDate) && financeiroData <= new Date(endDate)
        : isStartDateValid;
  
      const financeiroDataVencimento = new Date(financeiro.dataVencimento);
      const isDueDateValid = dueDate ? financeiroDataVencimento.toDateString() === new Date(dueDate).toDateString() : true;
  
      const isSaleTypeValid = saleType ? financeiro.contrato === saleType : true;
      const isSalesPersonValid = salesPerson ? financeiro.operador === salesPerson : true;
      const isCobPersonValid = cobPerson ? 
        (financeiro.operadorSelecionado && financeiro.operadorSelecionado.value === cobPerson) : true;
  
      // Verifique se encaminharCliente é "sim"
      const isEncaminharClienteValid = financeiro.encaminharCliente === "sim";
  
      return matchesSearchTerm && isDateInRange && isDueDateValid && isSaleTypeValid && isSalesPersonValid && isCobPersonValid && isEncaminharClienteValid;
    });
  
    return filteredClients;
  };
  
  const filteredClients = applyFilters();
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const currentClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const openModalExcel = () => setModalExcel(true);
  const closeModalExcel = () => setModalExcel(false);

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    setModalExcel(false);
  };

  return (
    <div className="list-dashboard">
      {modalExcel && (
        <ModalExcel onClose={closeModalExcel} onApplyFilters={handleApplyFilters} />
      )}

      <div className="header-list">
        <div className="header-content">
          <h2>Cobrança</h2>
          <div className="search-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="selects-container">
            <button className="filtros-btn" onClick={openModalExcel}>
              <FontAwesomeIcon icon={faFilter} color="#fff" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : filteredClients.length === 0 ? (
        <div className="no-clients">Nenhum cliente encontrado.</div>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>CNPJ</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Operador</th>
                <th>Cobrador</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentClients.map((financeiro) => (
                <tr key={financeiro.id}>
                  <td></td>
                  <td className={`${selectedItems.has(financeiro.id) ? "selected" : ""}`}>
                    {financeiro.cnpj || financeiro.cpf}
                  </td>
                  <td className={`${selectedItems.has(financeiro.id) ? "selected" : ""}`}>
                    {financeiro.responsavel}
                  </td>
                  <td className={`${selectedItems.has(financeiro.id) ? "selected" : ""}`}>
                    {financeiro.email1 || financeiro.email2}
                  </td>
                  <td className={`${selectedItems.has(financeiro.id) ? "selected" : ""}`}>
                    {financeiro.operador}
                  </td>
                  <td className={`${selectedItems.has(financeiro.id) ? "selected" : ""}`}>
                    {financeiro.operadorSelecionado ? financeiro.operadorSelecionado.label : ""}
                  </td>
                  <td className="icon-container">
                    <Link to={`/contrato/${financeiro.id}`}>
                      <FontAwesomeIcon icon={faEye} className="icon-spacing text-dark" />
                    </Link>
                    <Link to={`/fichacobranca/${financeiro.id}`}>
                      <FontAwesomeIcon icon={faTableList} className="icon-spacing text-dark" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <span>Página {currentPage} de {totalPages}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
