import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiHome, FiFolder, FiCheckSquare, FiUsers, FiUser, FiLogOut, FiActivity } from "react-icons/fi";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: <FiHome size={20} /> },
  { to: "/projects", label: "Projects", icon: <FiFolder size={20} /> },
  { to: "/tasks", label: "Tasks", icon: <FiCheckSquare size={20} /> },
  { to: "/members", label: "Members", icon: <FiUsers size={20} />, roles: ["Admin", "Menaxher"] },
  { to: "/users", label: "Users", icon: <FiUser size={20} />, roles: ["Admin"] },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout, roles } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="sidebar p-4 d-flex flex-column justify-content-between min-vh-100" style={{ width: "260px", height: "100vh", position:"sticky", top:0 }}>
      <div>
        <div className="d-flex align-items-center gap-3 mb-5 px-2">
          <h2 className="h4 mb-0 fw-bold text-white tracking-tight">Task Manager</h2>
        </div>
        <nav className="d-flex flex-column gap-2">
          <div className="text-muted small fw-bold mb-2 px-3 text-uppercase tracking-wider">Menu</div>
          {navItems.filter(item => !item.roles || item.roles.some((role) => roles.includes(role))).map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link text-decoration-none ${isActive ? "active" : ""}`}>
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="mt-4 border-top border-secondary pt-4">
        <button 
          type="button" 
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2" 
          onClick={handleLogout}
        >
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
