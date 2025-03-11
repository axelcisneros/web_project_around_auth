import { useContext } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import CurrentUserContext from '@contexts/CurrentUserContext.js';
import { removeToken } from "@utils/token";
import Logo from "../Logo/Logo";

// Especificar setIsLoggedIn como una propiedad. ¡No olvides pasar
// setIsLoggedIn como una propiedad del componente App!
function NavBar() {
  // Invocar el hook.
  const navigate = useNavigate();

  const { isLoggedIn, setIsLoggedIn, userData } = useContext(CurrentUserContext);
  
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  // La función signOut elimina el token del almacenamiento
  // local, los envía de vuelta a la página de inicio de sesión, y
  // establece isLoggedIn como falso.
  function signOut() {
    removeToken();
    navigate("/login");
    setIsLoggedIn(false);
  }


  function handleLogin() {
    if (isLoginPage) {
      navigate("/register");
    } else {
      navigate("/login");
    }
  }
  
  
  return (
    <nav className="nav">
      <div className="nav__logo">
        <Logo />
      </div>
      <ul className="nav__links">
        <li>
          <NavLink to="/my-profile" className="nav__link">
            {isLoggedIn ? userData.email : ""}
          </NavLink>
        </li>
        <li>
          <button onClick={signOut} className={`nav__link nav__button ${isLoggedIn ? "" : "login__link_visible" }`}>Cerrar sesión</button>
        </li>
        <li>
          <button onClick={handleLogin} className={`nav__link nav__button ${isLoggedIn ? "login__link_visible" : "" }`}>{isLoginPage ? "Regístrate" : "Iniciar sesión"}</button>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
