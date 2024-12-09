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
import { db } from "../../../../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  writeBatch,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import { Tooltip } from "react-tooltip";

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

export const ListDashboard: React.FC<ListDashboardProps> = ({
  setTotalFinanceiros,
  setTotalPagos,
  setTotalNegativados,
  setTotalCancelados,
}) => {
  const [financeiros, setFinanceiros] = useState<Marketing[]>([]);
  const [selectedItems] = useState<Set<string>>(new Set());
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
    salesPerson: "",
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

        const totalPagos = financeirosList.filter(
          (financeiro) => financeiro.rePagamento === "sim"
        ).length;
        setTotalPagos(totalPagos);
        const totalNegativados = financeirosList.filter(
          (financeiro) => financeiro.rePagamento === "nao"
        ).length;
        setTotalNegativados(totalNegativados);
        const totalCancelados = financeirosList.filter(
          (financeiro) => financeiro.rePagamento === "cancelado"
        ).length;
        setTotalCancelados(totalCancelados);
      } catch (error) {
        console.error("Erro ao buscar financeiros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceiros();
  }, [
    setTotalFinanceiros,
    setTotalPagos,
    setTotalNegativados,
    setTotalCancelados,
  ]);

  const applyFilters = () => {
    let filteredClients = financeiros.filter((marketing) => {
      const lowerCaseTerm = searchTerm.toLowerCase();
      const matchesSearchTerm =
        (marketing.cnpj &&
          marketing.cnpj.toLowerCase().includes(lowerCaseTerm)) ||
        (marketing.cpf &&
          marketing.cpf.toLowerCase().includes(lowerCaseTerm)) ||
        (marketing.responsavel &&
          marketing.responsavel.toLowerCase().includes(lowerCaseTerm)) ||
        (marketing.email1 &&
          marketing.email1.toLowerCase().includes(lowerCaseTerm)) ||
        (marketing.email2 &&
          marketing.email2.toLowerCase().includes(lowerCaseTerm)) ||
        (marketing.operador &&
          marketing.operador.toLowerCase().includes(lowerCaseTerm));

      const { startDate, endDate, dueDate, saleType, salesPerson } = filters;

      const marketingData = new Date(marketing.data);
      const isStartDateValid = startDate
        ? marketingData.toDateString() === new Date(startDate).toDateString()
        : true;

      const isDateInRange =
        startDate && endDate
          ? marketingData >= new Date(startDate) &&
            marketingData <= new Date(endDate)
          : isStartDateValid;

      const marketingDataVencimento = new Date(marketing.dataVencimento);
      const isDueDateValid = dueDate
        ? marketingDataVencimento.toDateString() ===
          new Date(dueDate).toDateString()
        : true;

      const isSaleTypeValid = saleType ? marketing.contrato === saleType : true;
      const isSalesPersonValid = salesPerson
        ? marketing.operador === salesPerson
        : true;

      return (
        matchesSearchTerm &&
        isDateInRange &&
        isDueDateValid &&
        isSaleTypeValid &&
        isSalesPersonValid
      );
    });
    if (showCancelados) {
      filteredClients = filteredClients.filter(
        (marketing) => marketing.rePagamento === "cancelado"
      );
    }
    if (showNegativos) {
      filteredClients = filteredClients.filter(
        (marketing) => marketing.rePagamento === "nao"
      );
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
      const salesList = salesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Sale[];

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

      toast.success("Sincronização concluída!");
    } catch (error) {
      console.error("Erro ao sincronizar clientes:", error);
      toast.error("Erro na sincronização!");
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

    const selectedFields = [
      "cnpj",
      "cpf",
      "responsavel",
      "email1",
      "email2",
      "operador",
      "data",
      "dataVencimento",
      "rePagamento",
      "dataPagamento",
      "encaminharCliente",
      "operadorSelecionado",
    ];

    const filteredData = clientsToDownload.map((financeiro) => {
      return selectedFields.reduce((selectedData, field) => {
        if (field in financeiro) {
          selectedData[field] = financeiro[field as keyof Marketing];
        }
        return selectedData;
      }, {} as { [key: string]: any });
    });

    const ws = XLSX.utils.json_to_sheet(filteredData);
    const range = XLSX.utils.decode_range(ws["!ref"]!);
    ws["!autofilter"] = { ref: XLSX.utils.encode_range(range) };

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

  const formatCPF = (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
      .substring(0, 14);
  };

  // Função para formatar o CNPJ (visual)
  const formatCNPJ = (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
      .replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5")
      .substring(0, 18);
  };
  return (
    <div className="list-dashboard">
      {modalExcel && (
        <ModalExcel
          onClose={closeModalExcel}
          onApplyFilters={handleApplyFilters}
        />
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
            <button
              className="filtros-btn"
              onClick={openModalExcel}
              data-tooltip-id="tooltip-filter"
              data-tooltip-content="Aplicar filtros"
            >
              <FontAwesomeIcon icon={faFilter} color="#fff" />
            </button>

            {showCancelados ? (
              <button
                className="remove-btn"
                onClick={toggleCancelado}
                data-tooltip-id="tooltip-remove-cancelado"
                data-tooltip-content="Remover cancelados"
              >
                <FontAwesomeIcon icon={faX} color="#fff" />
              </button>
            ) : (
              <button
                className="concluido-btn"
                onClick={toggleCancelado}
                data-tooltip-id="tooltip-add-cancelado"
                data-tooltip-content="Mostrar cancelados"
              >
                <FontAwesomeIcon icon={faCancel} color="#fff" />
              </button>
            )}

            {showNegativos ? (
              <button
                className="remove-btn"
                onClick={toggleNegativo}
                data-tooltip-id="tooltip-remove-negativo"
                data-tooltip-content="Remover negativos"
              >
                <FontAwesomeIcon icon={faX} color="#fff" />
              </button>
            ) : (
              <button
                className="concluido-btn"
                onClick={toggleNegativo}
                data-tooltip-id="tooltip-add-negativo"
                data-tooltip-content="Mostrar negativos"
              >
                <FontAwesomeIcon icon={faMinus} color="#fff" />
              </button>
            )}

            <button
              className="planilha-btn"
              onClick={downloadClients}
              data-tooltip-id="tooltip-download"
              data-tooltip-content="Baixar planilha"
            >
              <FontAwesomeIcon icon={faDownload} color="#fff" />
            </button>

            <button
              className="remove-btn"
              onClick={handleSyncClients}
              disabled={syncLoading}
              data-tooltip-id="tooltip-sync"
              data-tooltip-content={
                syncLoading ? "Sincronizando..." : "Sincronizar clientes"
              }
            >
              {syncLoading ? (
                <FontAwesomeIcon icon={faSync} spin color="#fff" />
              ) : (
                <FontAwesomeIcon icon={faSync} color="#fff" />
              )}
            </button>

            {/* Tooltips */}
            <Tooltip
              id="tooltip-filter"
              place="top"
              className="custom-tooltip"
            />
            <Tooltip
              id="tooltip-remove-cancelado"
              place="top"
              className="custom-tooltip"
            />
            <Tooltip
              id="tooltip-add-cancelado"
              place="top"
              className="custom-tooltip"
            />
            <Tooltip
              id="tooltip-remove-negativo"
              place="top"
              className="custom-tooltip"
            />
            <Tooltip
              id="tooltip-add-negativo"
              place="top"
              className="custom-tooltip"
            />
            <Tooltip
              id="tooltip-download"
              place="top"
              className="custom-tooltip"
            />
            <Tooltip id="tooltip-sync" place="top" className="custom-tooltip" />
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
                <th>CNPJ/CPF</th>
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
                    className={
                      selectedItems.has(marketing.id) ? "selected" : ""
                    }
                  >
                    {marketing.cnpj
                      ? formatCNPJ(marketing.cnpj)
                      : marketing.cpf
                      ? formatCPF(marketing.cpf)
                      : marketing.cnpj || marketing.cpf}
                  </td>
                  <td
                    className={`${
                      selectedItems.has(marketing.id) ? "selected" : ""
                    } ${
                      marketing.encaminharCliente === "sim"
                        ? "cobranca-encaminhado"
                        : ""
                    }`}
                  >
                    {marketing.responsavel}
                  </td>
                  <td
                    className={`${
                      selectedItems.has(marketing.id) ? "selected" : ""
                    } ${
                      marketing.encaminharCliente === "sim"
                        ? "cobranca-encaminhado"
                        : ""
                    }`}
                  >
                    {marketing.email1 || marketing.email2}
                  </td>
                  <td
                    className={`${
                      selectedItems.has(marketing.id) ? "selected" : ""
                    } ${
                      marketing.encaminharCliente === "sim"
                        ? "cobranca-encaminhado"
                        : ""
                    }`}
                  >
                    {marketing.operador.replace(/\./g, " ")}
                  </td>
                  <td className="icon-container">
                    <Link
                      to={`/contrato/${marketing.id}`}
                      data-tooltip-id="tooltip-eye"
                      data-tooltip-content="Visualizar contrato"
                    >
                      <FontAwesomeIcon
                        icon={faEye}
                        className="icon-spacing text-dark"
                      />
                    </Link>
                    <Link
                      to={`/fichafinanceiro/${marketing.id}`}
                      data-tooltip-id="tooltip-financeiro"
                      data-tooltip-content="Ficha financeiro"
                    >
                      <FontAwesomeIcon
                        icon={faTableList}
                        className="icon-spacing text-dark"
                      />
                    </Link>
                  </td>

                  {/* Tooltip */}
                  <Tooltip id="tooltip-eye" place="top" className="custom-tooltip" />
                  <Tooltip id="tooltip-financeiro" place="top" className="custom-tooltip" />
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
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
            <ToastContainer />
          </div>
        </>
      )}
    </div>
  );
};
