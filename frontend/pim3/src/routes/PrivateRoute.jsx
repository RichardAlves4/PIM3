import { Navigate } from 'react-router';

export function PrivateRoute({ children, onlyAdmin = false }) {
  const isLogged = localStorage.getItem("token_simulado") !== null;
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // 1. Se não estiver logado, manda para o login sempre
  if (!isLogged) {
    return <Navigate to="/" replace />;
  }

  // 2. Se a rota é exclusiva de Admin mas o usuário não é Admin
  if (onlyAdmin && !isAdmin) {
    // Opção A: Redirecionar para o NotFound (como você sugeriu)
    // Isso é bom para "esconder" que a página de admin existe
    return <Navigate to="/404" replace />;
    
    // Opção B: Redirecionar para o dashboard dele (o que você já tinha)
    // return <Navigate to="/user" replace />; 
  }
  return children;
}