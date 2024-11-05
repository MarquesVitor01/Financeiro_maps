import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faEdit,
  faEye,
  faSearch,
  faFilter,
  faRectangleList,
  faX,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { ModalExcel } from "./modalExcel";
import { db } from "../../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

interface Venda {
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
  monitoriaConcluidaYes: boolean;
}

interface ListDashboardProps {
  setTotalVendas: (total: number) => void;
  setTotalRealizados: (total: number) => void;
}

export const ListDashboard: React.FC<ListDashboardProps> = ({ setTotalVendas, setTotalRealizados }) => {
  const [vendas, setVendas] = useState<Venda[]>([]);
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
    salesPerson: ""
  });

  const [showConcluidas, setShowConcluidas] = useState(false);

  useEffect(() => {
    const fetchvendas = async () => {
      setLoading(true);
      try {
        const vendasCollection = collection(db, "vendas");
        const vendasSnapshot = await getDocs(vendasCollection);
        const vendasList = vendasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Venda[];

        setVendas(vendasList);
        setTotalVendas(vendasList.length);
        
        const totalRealizados = vendasList.filter(venda => venda.monitoriaConcluidaYes).length;
        setTotalRealizados(totalRealizados); 

      } catch (error) {
        console.error("Erro ao buscar vendas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchvendas();
  }, [setTotalVendas, setTotalRealizados]);

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
    let filteredClients = vendas.filter((venda) => {
      const lowerCaseTerm = searchTerm.toLowerCase();
      const matchesSearchTerm =
        (venda.cnpj && venda.cnpj.toLowerCase().includes(lowerCaseTerm)) ||
        (venda.cpf && venda.cpf.toLowerCase().includes(lowerCaseTerm)) ||
        (venda.responsavel && venda.responsavel.toLowerCase().includes(lowerCaseTerm)) ||
        (venda.email1 && venda.email1.toLowerCase().includes(lowerCaseTerm)) ||
        (venda.email2 && venda.email2.toLowerCase().includes(lowerCaseTerm)) ||
        (venda.operador && venda.operador.toLowerCase().includes(lowerCaseTerm));

      const { startDate, endDate, dueDate, saleType, salesPerson } = filters;

      const vendaData = new Date(venda.data);
      const isStartDateValid = startDate ? vendaData.toDateString() === new Date(startDate).toDateString() : true;

      const isDateInRange = (startDate && endDate)
        ? vendaData >= new Date(startDate) && vendaData <= new Date(endDate)
        : isStartDateValid;

      const vendaDataVencimento = new Date(venda.dataVencimento);
      const isDueDateValid = dueDate ? vendaDataVencimento.toDateString() === new Date(dueDate).toDateString() : true;

      const isSaleTypeValid = saleType ? venda.contrato === saleType : true;
      const isSalesPersonValid = salesPerson ? venda.operador === salesPerson : true;

      return matchesSearchTerm && isDateInRange && isDueDateValid && isSaleTypeValid && isSalesPersonValid;
    });

    if (showConcluidas) {
      filteredClients = filteredClients.filter((venda) => !venda.monitoriaConcluidaYes);
    }

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

  const toggleConcluido = () => {
    setShowConcluidas(!showConcluidas);
  };

  return (
    <div className="list-dashboard">
      {modalExcel && (
        <ModalExcel onClose={closeModalExcel} onApplyFilters={handleApplyFilters} />
      )}

      <div className="header-list">
        <div className="header-content">
          <h2>Monitoria</h2>
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

            {showConcluidas ? (
              <button className="remove-btn" onClick={toggleConcluido}>
                <FontAwesomeIcon icon={faX} color="#fff" className="" />
              </button>
            ) : (
              <button className="concluido-btn" onClick={toggleConcluido}>
                <FontAwesomeIcon icon={faBars} color="#fff" />
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : filteredClients.length === 0 ? (
        <div className="no-clients">Não existem vendas a exibir.</div>
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
                <th>Monitor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentClients.map((venda: Venda) => (
                <tr key={venda.id}>
                  <td></td>
                  <td className={`${selectedItems.has(venda.id) ? "selected" : ""} ${venda.monitoriaConcluidaYes ? "concluida" : ""}`}>
                    {venda.cnpj || venda.cpf}
                  </td>
                  <td className={`${selectedItems.has(venda.id) ? "selected" : ""} ${venda.monitoriaConcluidaYes ? "concluida" : ""}`}>
                    {venda.responsavel}
                  </td>
                  <td className={`${selectedItems.has(venda.id) ? "selected" : ""} ${venda.monitoriaConcluidaYes ? "concluida" : ""}`}>
                    {venda.email1}
                  </td>
                  <td className={`${selectedItems.has(venda.id) ? "selected" : ""} ${venda.monitoriaConcluidaYes ? "concluida" : ""}`}>
                    {venda.operador.replace(/\./g, " ")}
                  </td>
                  <td className={`${selectedItems.has(venda.id) ? "selected" : ""} ${venda.monitoriaConcluidaYes ? "concluida" : ""}`}>
                    {venda.nomeMonitor}
                  </td>
                  <td className="icon-container" >
                  <Link to={`/contrato/${venda.id}`}>
                      <FontAwesomeIcon icon={faEye} className="icon-spacing text-dark" />
                    </Link>
                    <Link to={`/editcontrato/${venda.id}`}>
                      <FontAwesomeIcon icon={faEdit} className="icon-spacing text-dark" />
                    </Link>
                    <Link to={`/fichamonitoria/${venda.id}`}>
                      <FontAwesomeIcon icon={faRectangleList} className="icon-spacing text-dark" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <span>{currentPage} / {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
