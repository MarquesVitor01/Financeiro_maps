import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faEye,
  faSearch,
  faFilter,
  faSync,
  faTableList,
  faX,
  faCancel,
  faMinus,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { ModalExcel } from "./modalExcel";
import { db } from "../../../../firebaseConfig";
import { collection, getDocs, getDoc, setDoc, doc, writeBatch } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from 'xlsx';

interface Marketing {
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
  servicosConcluidos: boolean;
  encaminharCliente: string;
  rePagamento: string;
}

interface Sale {
  id: string;
  cnpj: string;
  responsavel: string;
  email1: string;
  email2: string;
  operador: string;
  data: string;
  dataVencimento: string;
  contrato: string;
  nomeMonitor: string;
  monitoriaConcluidaYes: boolean;
  servicosConcluidos: boolean;
  rePagamento: string;
  dataPagamento: string;
  operadorSelecionado: { value: string; label: string } | null;
}

interface ListDashboardProps {
  setTotalFinanceiros: (total: number) => void;
  setTotalPagos: (total: number) => void;
  setTotalNegativados: (total: number) => void;
  setTotalCancelados: (total: number) => void;
}

export const ListDashboard: React.FC<ListDashboardProps> = ({ setTotalFinanceiros, setTotalPagos, setTotalNegativados, setTotalCancelados }) => {
  const [financeiros, setFinanceiros] = useState<Marketing[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modalExcel, setModalExcel] = useState(false);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [syncLoading, setSyncLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    dueDate: "",
    saleType: "",
    salesPerson: ""
  });

  const [showCancelados, setShowCancelados] = useState(false);
  const [showNegativos, setShowNegativos] = useState(false);

  useEffect(() => {
    const fetchFinanceiros = async () => {
      setLoading(true);
      try {
        const financeirosCollection = collection(db, "financeiros");
        const financeirosSnapshot = await getDocs(financeirosCollection);
        const financeirosList = financeirosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Marketing[];

        setFinanceiros(financeirosList);
        setTotalFinanceiros(financeirosList.length);

        const totalPagos = financeirosList.filter(financeiro => financeiro.rePagamento === "sim").length;
        setTotalPagos(totalPagos); 
        const totalNegativados = financeirosList.filter(financeiro => financeiro.rePagamento === "nao").length;
        setTotalNegativados(totalNegativados); 
        const totalCancelados = financeirosList.filter(financeiro => financeiro.rePagamento === "cancelado").length;
        setTotalCancelados(totalCancelados); 
      } catch (error) {
        console.error("Erro ao buscar financeiros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceiros();
  }, [setTotalFinanceiros, setTotalPagos, setTotalNegativados, setTotalCancelados]);


  const applyFilters = () => {
    let filteredClients = financeiros.filter((marketing) => {
      const lowerCaseTerm = searchTerm.toLowerCase();
      const matchesSearchTerm =
        (marketing.cnpj && marketing.cnpj.toLowerCase().includes(lowerCaseTerm)) ||
        (marketing.cpf && marketing.cpf.toLowerCase().includes(lowerCaseTerm)) ||
        (marketing.responsavel && marketing.responsavel.toLowerCase().includes(lowerCaseTerm)) ||
        (marketing.email1 && marketing.email1.toLowerCase().includes(lowerCaseTerm)) ||
        (marketing.email2 && marketing.email2.toLowerCase().includes(lowerCaseTerm)) ||
        (marketing.operador && marketing.operador.toLowerCase().includes(lowerCaseTerm));

      const { startDate, endDate, dueDate, saleType, salesPerson } = filters;

      const marketingData = new Date(marketing.data);
      const isStartDateValid = startDate ? marketingData.toDateString() === new Date(startDate).toDateString() : true;

      const isDateInRange = (startDate && endDate)
        ? marketingData >= new Date(startDate) && marketingData <= new Date(endDate)
        : isStartDateValid;

      const marketingDataVencimento = new Date(marketing.dataVencimento);
      const isDueDateValid = dueDate ? marketingDataVencimento.toDateString() === new Date(dueDate).toDateString() : true;

      const isSaleTypeValid = saleType ? marketing.contrato === saleType : true;
      const isSalesPersonValid = salesPerson ? marketing.operador === salesPerson : true;

      return matchesSearchTerm && isDateInRange && isDueDateValid && isSaleTypeValid && isSalesPersonValid;
    });
    if (showCancelados) {
      filteredClients = filteredClients.filter((marketing) => marketing.rePagamento === "cancelado");
    }
    if (showNegativos) {
      filteredClients = filteredClients.filter((marketing) => marketing.rePagamento === "nao");
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

  const handleSyncClients = async () => {
    setSyncLoading(true); 
    try {
        const salesCollection = collection(db, "marketings");
        const salesSnapshot = await getDocs(salesCollection);
        const salesList = salesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Sale[];

        const syncedSales = salesList.filter((sale) => sale.servicosConcluidos);
        const batch = writeBatch(db);
        for (const sale of syncedSales) {
          const marketingDocRef = doc(db, "financeiros", sale.id);
          batch.set(marketingDocRef, sale, { merge: true });
        }

        await batch.commit();

        const financeirosSnapshot = await getDocs(collection(db, "financeiros"));
        const financeirosList = financeirosSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Marketing[];

        setFinanceiros(financeirosList);
        setTotalFinanceiros(financeirosList.length);

        toast.success('Sincronização concluída!');
    } catch (error) {
        console.error("Erro ao sincronizar clientes:", error);
        toast.error('Erro na sincronização!');
    } finally {
        setSyncLoading(false); 
    }
};

const handleApplyFilters = (newFilters: any) => {
  setFilters(newFilters);
  setModalExcel(false);
};


const downloadClients = () => {
  const clientsToDownload = applyFilters();

  const selectedFields = ["cnpj", "cpf", "responsavel", "email1", "email2", "operador", "data", "dataVencimento", "rePagamento", "dataPagamento", "encaminharCliente", "operadorSelecionado"]; 

  const filteredData = clientsToDownload.map((financeiro) => {
    return selectedFields.reduce((selectedData, field) => {
      if (field in financeiro) {
        selectedData[field] = financeiro[field as keyof Marketing];
      }
      return selectedData;
    }, {} as { [key: string]: any });
  });

  const ws = XLSX.utils.json_to_sheet(filteredData);
  const range = XLSX.utils.decode_range(ws['!ref']!);
  ws['!autofilter'] = { ref: XLSX.utils.encode_range(range) };

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "vendas");

  XLSX.writeFile(wb, "planilha_vendas.xlsx");
};


  const toggleCancelado = () => {
    setShowCancelados(!showCancelados);
  };

  const toggleNegativo = () => {
    setShowNegativos(!showNegativos);
  };
  return (
    <div className="list-dashboard">
      {modalExcel && (
        <ModalExcel onClose={closeModalExcel} onApplyFilters={handleApplyFilters} />
      )}

      <div className="header-list">
        <div className="header-content">
          <h2>Financeiro</h2>
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
            {showCancelados ? (
              <button className="remove-btn" onClick={toggleCancelado}>
                <FontAwesomeIcon icon={faX} color="#fff" className="" />
              </button>
            ) : (
              <button className="concluido-btn" onClick={toggleCancelado}>
                <FontAwesomeIcon icon={faCancel} color="#fff" />
              </button>
            )}
            {showNegativos ? (
              <button className="remove-btn" onClick={toggleNegativo}>
                <FontAwesomeIcon icon={faX} color="#fff" className="" />
              </button>
            ) : (
              <button className="concluido-btn" onClick={toggleNegativo}>
                <FontAwesomeIcon icon={faMinus} color="#fff" />
              </button>
            )}
            <button className="planilha-btn" onClick={downloadClients}>
              <FontAwesomeIcon icon={faDownload} color="#fff" />
            </button>
            <button className="remove-btn" onClick={handleSyncClients} disabled={syncLoading}>
    {syncLoading ? (
        <FontAwesomeIcon icon={faSync} spin color="#fff" />
    ) : (
        <FontAwesomeIcon icon={faSync} color="#fff" />
    )}
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentClients.map((marketing) => (
                <tr key={marketing.id}>
                  <td></td>
                  <td
                    className={`${selectedItems.has(marketing.id) ? "selected" : ""} ${marketing.encaminharCliente === "sim" ? "cobranca-encaminhado" : ""}`}
                  >
                    {marketing.cnpj || marketing.cpf}
                  </td>
                  <td
                    className={`${selectedItems.has(marketing.id) ? "selected" : ""} ${marketing.encaminharCliente === "sim" ? "cobranca-encaminhado" : ""}`}
                  >
                    {marketing.responsavel}
                  </td>
                  <td
                    className={`${selectedItems.has(marketing.id) ? "selected" : ""} ${marketing.encaminharCliente === "sim" ? "cobranca-encaminhado" : ""}`}
                  >
                    {marketing.email1 || marketing.email2}
                  </td>
                  <td
                    className={`${selectedItems.has(marketing.id) ? "selected" : ""} ${marketing.encaminharCliente === "sim" ? "cobranca-encaminhado" : ""}`}
                  >
                    {marketing.operador.replace(/\./g, " ")}
                  </td>
                  <td className="icon-container">
                    <Link to={`/contrato/${marketing.id}`}>
                      <FontAwesomeIcon icon={faEye} className="icon-spacing text-dark" />
                    </Link>
                    <Link to={`/fichafinanceiro/${marketing.id}`}>
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
            <ToastContainer />
          </div>
        </>
      )}
    </div>
  );
};
