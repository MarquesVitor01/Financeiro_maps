import React, { useState } from "react";
import { HeaderDash } from "./components/header-dash";
import "../financeiro/components/dashboard.css";
import { ListDashboard } from "./components/list-dashboard";

export const Financeiro = () => {
  const [totalFinanceiros, setTotalFinanceiros] = useState(0);
  const [totalPagos, setTotalPagos] = useState(0); 
  const [totalNegativados, setTotalNegativados] = useState(0); 
  const [totalCancelados, setTotalCancelados] = useState(0); 

  

  return (
    <div className="bg-dash">
      <div className="itens-dash">
        <HeaderDash totalFinanceiros={totalFinanceiros} totalPagos={totalPagos} totalNegativados={totalNegativados} totalCancelados={totalCancelados}/>
        <ListDashboard setTotalFinanceiros={setTotalFinanceiros} setTotalPagos={setTotalPagos} setTotalNegativados={setTotalNegativados} setTotalCancelados={setTotalCancelados}/> 
      </div>
    </div>
  );
};
