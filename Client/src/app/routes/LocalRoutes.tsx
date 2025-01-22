import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "./PrivatesRoute";
import { Login, Home, Add, ListPositive, ListNegative } from "../pages";
import { Navbar } from "../components/navbar/navbar";
import { Lembretes } from "../pages/lembretes/Lembretes";

export const LocalRoutes: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
      <NavbarWrapper />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/add" element={<Add />} />
          <Route path="/listpositive" element={<ListPositive />} />
          <Route path="/listnegative" element={<ListNegative/>} />
          <Route path="/lembretes" element={<Lembretes/>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

const NavbarWrapper: React.FC = () => {
  const location = useLocation();
  const showNavbarRoutes = ["/home", "/listpositive", "/listnegative", '/lembretes'];

  return showNavbarRoutes.includes(location.pathname) ? <Navbar /> : null;
};