import { Navigate } from 'react-router';

export function PrivateRoute({ children, onlyAdmin = false }) {
  // 1. Verifica se o usuário está autenticado checando a existência do token no storage
  const isLogged = localStorage.getItem("token_simulado") !== null;
  
  // 2. Verifica o nível de acesso do usuário recuperado durante o login
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // 3. Bloqueio de Acesso Geral: 
  // Se o usuário NÃO estiver logado, redireciona para a raiz ('/')
  // O atributo 'replace' impede que o usuário volte para a rota protegida ao clicar no botão "voltar" do browser
  if (!isLogged) {
    return <Navigate to="/" replace />;
  }

  // 4. Bloqueio de Nível de Acesso:
  // Se a rota for restrita para admin (onlyAdmin=true) E o usuário logado NÃO for admin
  if (onlyAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // 5. Autorização Concedida:
  // Se passar por todas as verificações, renderiza os componentes filhos (a página protegida)
  return children;
}