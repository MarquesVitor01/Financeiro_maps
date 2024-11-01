import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faEdit,
  faEye,
  faSearch,
  faTrashAlt,
  faFilter,
  faDownload,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { ModalExcel } from "./modalExcel";
import { db } from "../../../../firebaseConfig";
import { collection, getDocs, doc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import * as XLSX from 'xlsx';

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
  createdBy: string;
  setor: string;
}

interface ListDashboardProps {
  setTotalVendas: (total: number) => void;
}

export const ListDashboard: React.FC<ListDashboardProps> = ({ setTotalVendas }) => {
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

  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const adminUserId = "9CfoYP8HtPg7nymfGzrn8GE2NOR2";
  const SupervisorUserId = "wWLmbV9TIUemmTkcMUSAQ4xGlju2";

  useEffect(() => {
    const fetchVendas = async () => {
      setLoading(true);
      try {
        const vendasCollection = collection(db, "vendas");
        const vendasSnapshot = await getDocs(vendasCollection);
        const vendasList = vendasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Venda[];

        const filteredVendas = ((userId === adminUserId) || (userId === SupervisorUserId))
          ? vendasList
          : vendasList.filter((venda) => venda.createdBy === userId);

        setVendas(filteredVendas);
        setTotalVendas(filteredVendas.length);
      } catch (error) {
        console.error("Erro ao buscar vendas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendas();
  }, [setTotalVendas, userId]);

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

  const handleRemoveSelected = async () => {
    if (selectedItems.size === 0) return;

    const deletePromises = Array.from(selectedItems).map(async (id) => {
      const vendaDoc = doc(db, "vendas", id);
      const vendaData = (await getDoc(vendaDoc)).data();

      if (vendaData) {
        await setDoc(doc(db, "cancelados", id), {
          ...vendaData,
          deletedAt: new Date()
        });
      }

      await deleteDoc(vendaDoc);
    });

    await Promise.all(deletePromises);

    setVendas((prevVendas) => {
      return prevVendas.filter((venda) => !selectedItems.has(venda.id));
    });
    setSelectedItems(new Set());
  };

  const applyFilters = () => {
    const filteredClients = vendas.filter((venda) => {
      const lowerCaseTerm = searchTerm.toLowerCase();
      const matchesSearchTerm =
        (venda.cnpj && venda.cnpj.toLowerCase().includes(lowerCaseTerm)) ||
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

  const downloadClients = () => {
    const clientsToDownload = applyFilters();

    const selectedFields = ["cnpj", "cpf", "razaoSocial", "responsavel", "email1", "email2", "fixo", "celular", "whatsapp", "operador", "valorVenda", "parcelas", "data", "validade", "dataVencimento"];

    const filteredData = clientsToDownload.map((venda) => {
      return selectedFields.reduce((selectedData, field) => {
        if (venda[field as keyof Venda]) {
          selectedData[field] = venda[field as keyof Venda];
        }
        return selectedData;
      }, {} as { [key: string]: any });
    });

    // Cria a planilha com os dados filtrados
    const ws = XLSX.utils.json_to_sheet(filteredData);

    // Define o range de células e aplica o filtro
    const range = XLSX.utils.decode_range(ws['!ref']!);
    ws['!autofilter'] = { ref: XLSX.utils.encode_range(range) };

    // Cria o workbook e adiciona a worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "vendas");

    // Exporta o arquivo Excel com o filtro aplicado
    XLSX.writeFile(wb, "planilha_vendas.xlsx");
  };




  return (
    <div className="list-dashboard">
      {modalExcel && (
        <ModalExcel onClose={closeModalExcel} onApplyFilters={handleApplyFilters} />
      )}

      <div className="header-list">
        <div className="header-content">
          <h2>Vendas</h2>
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
            <Link to='/add' className="create-btn">
              <FontAwesomeIcon icon={faPlus} />
            </Link>
            {
              adminUserId &&
              <button onClick={handleRemoveSelected} className="remove-btn">
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            }
            <button className="filtros-btn" onClick={openModalExcel}>
              <FontAwesomeIcon icon={faFilter} color="#fff" />
            </button>
            <button className="planilha-btn" onClick={downloadClients}>
              <FontAwesomeIcon icon={faDownload} color="#fff" />
            </button>
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentClients.map((venda: Venda) => (
                <tr key={venda.id}>
                  <td className={selectedItems.has(venda.id) ? "selected" : ""}>
                    <input
                      type="checkbox"
                      checked={selectedItems.has(venda.id)}
                      onChange={() => handleCheckboxChange(venda.id)}
                      className="checkbox-table"
                    />
                  </td>
                  <td className={selectedItems.has(venda.id) ? "selected" : ""}>
                    {venda.cnpj || venda.cpf}
                  </td>
                  <td className={selectedItems.has(venda.id) ? "selected" : ""}>
                    {venda.responsavel}
                  </td>
                  <td className={selectedItems.has(venda.id) ? "selected" : ""}>
                    {venda.email1}
                  </td>
                  <td className={selectedItems.has(venda.id) ? "selected" : ""}>
                    {venda.operador}
                  </td>

                  <td className={"icon-container"}>
                    <Link to={`/editcontrato/${venda.id}`}>
                      <FontAwesomeIcon icon={faEdit} className="icon-spacing text-dark" />
                    </Link>
                    <Link to={`/contrato/${venda.id}`}>
                      <FontAwesomeIcon icon={faEye} className="icon-spacing text-dark" />
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
            <span>{currentPage} de {totalPages}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
