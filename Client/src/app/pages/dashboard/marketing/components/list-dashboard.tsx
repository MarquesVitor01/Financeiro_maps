import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faEye,
  faSearch,
  faFilter,
  faPlus,
  faSync,
  faTableList,
  faX,
  faBars,
  faMoneyCheckDollar,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { ModalExcel } from "./modalExcel";
import { db } from "../../../../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  writeBatch,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { getAuth } from "firebase/auth";

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
  createdBy: string;
}

interface venda {
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
}

interface ListDashboardProps {
  setTotalMarketings: (total: number) => void;
  setTotalRealizados: (total: number) => void;
}

export const ListDashboard: React.FC<ListDashboardProps> = ({
  setTotalMarketings,
  setTotalRealizados,
}) => {
  const [marketings, setMarketings] = useState<Marketing[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modalExcel, setModalExcel] = useState(false);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState<boolean>(true);
  const [modalExclusao, setModalExclusao] = useState(false);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [syncLoading, setSyncLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    dueDate: "",
    vendaType: "",
    vendasPerson: "",
  });
  const [showConcluidas, setShowConcluidas] = useState(false);

  useEffect(() => {
    const fetchMarketings = async () => {
      setLoading(true);
      try {
        const marketingsCollection = collection(db, "marketings");
        const marketingsSnapshot = await getDocs(marketingsCollection);
        const marketingsList = marketingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Marketing[];

        setMarketings(marketingsList);
        setTotalMarketings(marketingsList.length);

        const totalRealizados = marketingsList.filter(
          (marketing) => marketing.servicosConcluidos
        ).length;
        setTotalRealizados(totalRealizados);
      } catch (error) {
        console.error("Erro ao buscar marketings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketings();
  }, [setTotalMarketings, setTotalRealizados]);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const adminUserId = "9CfoYP8HtPg7nymfGzrn8GE2NOR2";
  const SupervisorUserId = "wWLmbV9TIUemmTkcMUSAQ4xGlju2";

  useEffect(() => {
    const fetchVendas = async () => {
      setLoading(true);
      try {
        const marketingsCollection = collection(db, "marketings");
        const marketingsSnapshot = await getDocs(marketingsCollection);
        const marketingsList = marketingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Marketing[];

        const filteredVendas =
          userId === adminUserId || userId === SupervisorUserId
            ? marketingsList
            : marketingsList.filter(
                (marketing) => marketing.createdBy === userId
              );

        setMarketings(filteredVendas);
        setTotalMarketings(filteredVendas.length);
      } catch (error) {
        console.error("Erro ao buscar marketings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendas();
  }, [setTotalMarketings, userId]);

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

  const openModalExclusao = () => setModalExclusao(true);
  const closeModalExclusao = () => setModalExclusao(false);

  const handleRemoveSelected = async () => {
    if (selectedItems.size === 0) return;

    const deletePromises = Array.from(selectedItems).map(async (id) => {
      const marketingDoc = doc(db, "marketings", id);
      const vendaData = (await getDoc(marketingDoc)).data();

      if (vendaData) {
        await setDoc(doc(db, "cancelados", id), {
          ...vendaData,
          deletedAt: new Date(),
        });
      }

      await deleteDoc(marketingDoc);
    });

    await Promise.all(deletePromises);

    setMarketings((prevVendas) => {
      return prevVendas.filter((marketing) => !selectedItems.has(marketing.id));
    });
    setSelectedItems(new Set());
  };

  const applyFilters = () => {
    let filteredClients = marketings.filter((marketing) => {
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

      const { startDate, endDate, dueDate, vendaType, vendasPerson } = filters;

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

      const isvendaTypeValid = vendaType
        ? marketing.contrato === vendaType
        : true;
      const isvendasPersonValid = vendasPerson
        ? marketing.operador === vendasPerson
        : true;

      return (
        matchesSearchTerm &&
        isDateInRange &&
        isDueDateValid &&
        isvendaTypeValid &&
        isvendasPersonValid
      );
    });

    if (showConcluidas) {
      filteredClients = filteredClients.filter(
        (marketing) => !marketing.servicosConcluidos
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

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    setModalExcel(false);
  };

  const handleSyncClients = async () => {
    setSyncLoading(true);
    try {
      const vendasCollection = collection(db, "vendas");
      const vendasSnapshot = await getDocs(vendasCollection);
      const vendasList = vendasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as venda[];

      const syncedvendas = vendasList.filter(
        (venda) => venda.monitoriaConcluidaYes
      );

      const batch = writeBatch(db);
      for (const venda of syncedvendas) {
        const marketingDocRef = doc(db, "marketings", venda.id);
        batch.set(marketingDocRef, venda, { merge: true });
      }

      await batch.commit();

      const marketingsSnapshot = await getDocs(collection(db, "marketings"));
      const marketingsList = marketingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Marketing[];

      setMarketings(marketingsList);
      setTotalMarketings(marketingsList.length);
      toast.success("Sincronização concluída!");
    } catch (error) {
      console.error("Erro ao sincronizar clientes:", error);
      toast.error("Erro na sincronização!");
    } finally {
      setSyncLoading(false);
    }
  };

  const toggleConcluido = () => {
    setShowConcluidas(!showConcluidas);
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

      {modalExclusao && (
        <div className="modal-overlay">
          <div className="modal-exclusao">
            <div className="modal-header">
              <h2>Excluir Item</h2>
              <button
                className="close-btn"
                onClick={() => setModalExclusao(false)}
              >
                &#10006;
              </button>
            </div>
            <div className="modal-body">
              <p>Tem certeza de que deseja excluir este item?</p>
            </div>
            <div className="modal-footer">
              <button
                className="planilha-btn"
                onClick={() => {
                  handleRemoveSelected();
                  closeModalExclusao();
                }}
              >
                Confirmar
              </button>
              <button className="remove-btn" onClick={closeModalExclusao}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="header-list">
        <div className="header-content">
          <h2>Marketing</h2>
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
            <Link
              to="/add"
              className="create-btn"
              data-tooltip-id="tooltip-add"
              data-tooltip-content="Adicionar nova venda"
            >
              <FontAwesomeIcon icon={faPlus} />
            </Link>

            <button
              className="filtros-btn"
              onClick={openModalExcel}
              data-tooltip-id="tooltip-filter"
              data-tooltip-content="Aplicar filtros"
            >
              <FontAwesomeIcon icon={faFilter} color="#fff" />
            </button>

            {showConcluidas ? (
              <button
                className="remove-btn"
                onClick={toggleConcluido}
                data-tooltip-id="tooltip-close"
                data-tooltip-content="Fechar concluídas"
              >
                <FontAwesomeIcon icon={faX} color="#fff" />
              </button>
            ) : (
              <button
                className="clear-btn"
                onClick={toggleConcluido}
                data-tooltip-id="tooltip-view-all"
                data-tooltip-content="Ver todas"
              >
                <FontAwesomeIcon icon={faBars} color="#fff" />
              </button>
            )}

            <button
              className="planilha-btn"
              onClick={handleSyncClients}
              disabled={syncLoading}
              data-tooltip-id="tooltip-sync"
              data-tooltip-content={
                syncLoading ? "Sincronizando..." : "Sincronizar clientes"
              }
            >
              <FontAwesomeIcon icon={faSync} color="#fff" spin={syncLoading} />
            </button>

            {userId === adminUserId && (
              <button
                onClick={openModalExclusao}
                className="remove-btn"
                data-tooltip-id="remove-tooltip"
                data-tooltip-content="Remover selecionados"
              >
                <FontAwesomeIcon icon={faTrashAlt} />
                <Tooltip
                  id="remove-tooltip"
                  place="top"
                  className="custom-tooltip"
                />
              </button>
            )}

            {/* Tooltips */}
            <Tooltip id="tooltip-add" place="top" className="custom-tooltip" />
            <Tooltip
              id="tooltip-filter"
              place="top"
              className="custom-tooltip"
            />
            <Tooltip
              id="tooltip-close"
              place="top"
              className="custom-tooltip"
            />
            <Tooltip
              id="tooltip-view-all"
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
                <th>CNPJ</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Operador</th>
                <th>Monitor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentClients.map((marketing) => (
                <tr key={marketing.id}>
                  <td
                    className={
                      selectedItems.has(marketing.id) ? "selected" : ""
                    }
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.has(marketing.id)}
                      onChange={() => handleCheckboxChange(marketing.id)}
                      className="checkbox-table"
                    />
                  </td>
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
                      marketing.servicosConcluidos ? "servicos-realizados" : ""
                    }`}
                  >
                    {marketing.responsavel}
                  </td>
                  <td
                    className={`${
                      selectedItems.has(marketing.id) ? "selected" : ""
                    } ${
                      marketing.servicosConcluidos ? "servicos-realizados" : ""
                    }`}
                  >
                    {marketing.email1 || marketing.email2}
                  </td>
                  <td
                    className={`${
                      selectedItems.has(marketing.id) ? "selected" : ""
                    } ${
                      marketing.servicosConcluidos ? "servicos-realizados" : ""
                    }`}
                  >
                    {marketing.operador.replace(/\./g, " ")}
                  </td>
                  <td
                    className={`${
                      selectedItems.has(marketing.id) ? "selected" : ""
                    } ${
                      marketing.servicosConcluidos ? "servicos-realizados" : ""
                    }`}
                  >
                    {marketing.nomeMonitor}
                  </td>
                  <td className="icon-container">
                    <Link
                      to={`/contrato/${marketing.id}`}
                      data-tooltip-id="tooltip-view-contract"
                      data-tooltip-content="Visualizar contrato"
                    >
                      <FontAwesomeIcon
                        icon={faEye}
                        className="icon-spacing text-dark"
                      />
                    </Link>

                    <Link
                      to={`/fichamarketing/${marketing.id}`}
                      data-tooltip-id="tooltip-marketing-file"
                      data-tooltip-content="Ficha de marketing"
                    >
                      <FontAwesomeIcon
                        icon={faTableList}
                        className="icon-spacing text-dark"
                      />
                    </Link>
                    <Link to={`/fichaboleto/${marketing.id}`}>
                      <FontAwesomeIcon
                        icon={faMoneyCheckDollar}
                        className="icon-spacing text-dark"
                        data-tooltip-id="tooltip-boleto"
                        data-tooltip-content="Ver ficha de boleto"
                      />
                      <Tooltip
                        id="tooltip-boleto"
                        place="top"
                        className="custom-tooltip"
                      />
                    </Link>

                    {/* Tooltips */}
                    <Tooltip
                      id="tooltip-view-contract"
                      place="top"
                      className="custom-tooltip"
                    />
                    <Tooltip
                      id="tooltip-marketing-file"
                      place="top"
                      className="custom-tooltip"
                    />
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
