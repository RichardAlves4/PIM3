export function PrivateRoute({ children, onlyAdmin = false }) {
  const isLogged = localStorage.getItem("token_simulado") !== null;
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!isLogged) {
    return <Navigate to="/login" />;
  }

  if (onlyAdmin && !isAdmin) {
    // Se for uma franquia tentando entrar na área da franqueadora
    return <Navigate to="/dashboard-franquia" />; 
  }

  return children;
}