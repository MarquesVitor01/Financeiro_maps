import {
  faHome,
  faChartLine,
  faTachometerAlt,
  faBullhorn,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";
import "./navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const Navbar = () => {
  const { logout } = useAuth();

  const menuItems = [
    { to: "/home", icon: faHome, label: " Home" },
    { to: "/add", icon: faChartLine, label: " Adicionar Registros" },
    { to: "/listpositive", icon: faChartLine, label: " Registro de Entrada" },
    { to: "/listnegative", icon: faTachometerAlt, label: " Registro de Despesas" },
    { to: "/marketing", icon: faBullhorn, label: " Dashboards" },
    { to: "/financeiro", icon: faMoneyBillWave, label: " Lembretes" },
  ];

  return (
    <nav className="sidebar open">
      <div className="sidebar-sticky">
        <div className="sidebar-logo">
          <h2 className="mt-5 text-center">Financeiro</h2>
        </div>
        <ul className="nav options mt-5">
          {menuItems.map((item, index) => (
            <li className="nav-item" key={index}>
              <Link
                className="nav-link icon-tooltip"
                to={item.to}
                data-tooltip={item.label}
              >
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="logout-container">
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="sidebar-divisão"></div>
        <div className="profile-container">
          <div className="profile-avatar">
            <img src="https://th.bing.com/th/id/OIP.SV4C3GW8HPkY1y5SgsmkGQHaHa?rs=1&pid=ImgDetMain" alt="Avatar" />
          </div>
        </div>
      </div>
    </nav>
  );
};
