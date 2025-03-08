import { useContext } from "react"
import { Navigate, useLocation } from "react-router-dom";
import CurrentUserContext from '@contexts/CurrentUserContext.js';

// Nueva prop - anonymous. Esta propiedad se utilizará para indicar las rutas
// que pueden visitarse de forma anónima (es decir, sin autorización).
// Las dos rutas 'anónimas' de esta aplicación son /register
// y /login.
export default function ProtectedRoute({
  children,
  anonymous = false,
}) {

  // Invoca el hook useLocation y accede al valor de la propiedad
  // 'from' de su objeto state. Si no existe la propiedad 'from'
  // se utilizará por defecto "/".
  const location = useLocation();
  const from = location.state?.from || "/";

  const { isLoggedIn } = useContext(CurrentUserContext);
  
  // Si el usuario ha iniciado la sesión le redirigimos fuera de nuestras
  // rutas anónimas.
  if (anonymous && isLoggedIn) {
    return <Navigate to={from} />;
  }

  // Si el usuario no ha iniciado la sesión e intenta acceder a una ruta que
  // requiere autorización, le redirigimos a la ruta /login.
  if (!anonymous && !isLoggedIn) {
      // Mientras redirigimos a /login establecemos los objetos location
      // la propiedad state.from para almacenar el valor de la ubicación actual.
      // Esto nos permite redirigirles correctamente después de que
      // inicien sesión.
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // En caso contrario, muestra los hijos de la ruta actual.
  return children;
}
