import React, { useState } from "react";
import { HeaderDash } from "./components/header-dash";
import "../vendas/components/dashboard.css";
import { ListDashboard } from "./components/list-dashboard";

export const Vendas = () => {
  const [totalVendas, setTotalVendas] = useState(0);

  return (
    <div className="bg-dash">
      <div className="itens-dash">
        <HeaderDash totalVendas={totalVendas} />
        <ListDashboard setTotalVendas={setTotalVendas} /> 
      </div>
    </div>
  );
};
