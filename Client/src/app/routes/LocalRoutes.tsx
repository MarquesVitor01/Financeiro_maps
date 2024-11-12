import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "../components/navbar/navbar";
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "./PrivatesRoute";
import {
  Login,
  Setores,
  Perfil,
  Vendas,
  Monitoria,
  Marketing,
  Relatorio,
  Add,
  EditContrato,
  FichaMonitoria,
  FichaMarketing,
  FichaFinanceiro,
  FichaCobranca,
  FichaBoleto
} from "../pages";
import Contrato from "../pages/Contrato/Contrato";
import { Financeiro } from "../pages/dashboard/financeiro/Financeiro";
import { Cobranca } from "../pages/dashboard/cobranca/Cobranca";
import { Comprovantes } from "../pages/Comprovantes/Comprovantes";

export const LocalRoutes: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavbarWrapper />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/setores" element={<PrivateRoute element={<Setores />} />} />
          <Route path="/perfil" element={<PrivateRoute element={<Perfil />} />} />
          <Route path="/vendas" element={<PrivateRoute element={<Vendas />} requiredCargo="vendas" />} />
          <Route path="/monitoria" element={<PrivateRoute element={<Monitoria />} requiredCargo="monitoria" />} />
          <Route path="/marketing" element={<PrivateRoute element={<Marketing />} requiredCargo="marketing" />} />
          <Route path="/financeiro" element={<PrivateRoute element={<Financeiro />} requiredCargo="financeiro" />} />
          <Route path="/cobranca" element={<PrivateRoute element={<Cobranca />} requiredCargo="cobranca" />} />
          <Route path="/relatorio" element={<PrivateRoute element={<Relatorio />} />} />
          <Route path="/add" element={<PrivateRoute element={<Add />} />} />
          <Route path="/contrato/:id" element={<PrivateRoute element={<Contrato />} />} />
          <Route path="/editcontrato/:id" element={<PrivateRoute element={<EditContrato />} />} />
          <Route path="/comprovantes/:id" element={<PrivateRoute element={<Comprovantes />} />} />
          <Route path="/fichamonitoria/:id" element={<PrivateRoute element={<FichaMonitoria />} requiredCargo="monitoria" />} />
          <Route path="/fichamarketing/:id" element={<PrivateRoute element={<FichaMarketing />} requiredCargo="marketing" />} />
          <Route path="/fichafinanceiro/:id" element={<PrivateRoute element={<FichaFinanceiro />} requiredCargo="financeiro" />} />
          <Route path="/fichacobranca/:id" element={<PrivateRoute element={<FichaCobranca />} requiredCargo="cobranca" />} />
          <Route path="/fichaboleto/:id" element={<PrivateRoute element={<FichaBoleto />} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

const NavbarWrapper: React.FC = () => {
  const location = useLocation();
  const showNavbarRoutes = ["/vendas", "/monitoria", "/marketing", "/financeiro", "/cobranca"];

  return showNavbarRoutes.includes(location.pathname) ? <Navbar /> : null;
};