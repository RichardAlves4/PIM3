import React from "react";
// Hook do React Router para definir rotas através de objetos JavaScript em vez de componentes JSX
import { useRoutes } from "react-router";
import { Layout } from "../pages/Layout";
import { Login } from "../pages/login/Login";
import { PrivateRoute } from "./PrivateRoute";
import { HomeAdm } from "../pages/homeAdm/HomeAdm";
import { HomeUser } from "../pages/homeUser/HomeUser";

export function Routes() {
  // O hook useRoutes recebe um array de objetos que define a hierarquia de caminhos da URL
  const routes = useRoutes([
    {
      // Rota raiz da aplicação
      path: "/",
      // Define o componente de Layout como o "pai" desta rota
      element: <Layout />,
      // 'children' define rotas que serão renderizadas dentro do <Outlet /> do Layout
      children: [
        // index: true indica que este é o componente padrão quando o caminho for exatamente "/"
        { index: true, element: <Login /> }
      ],
    },

    {
      // Rota para usuários comuns
      path: "/user",
      element: (
        /* Envolvido pelo PrivateRoute sem a flag onlyAdmin, 
           exigindo apenas que o usuário esteja logado */
        <PrivateRoute>
          <HomeUser />
        </PrivateRoute>
      ),
    },
    {
      // Rota exclusiva para administradores (Franqueadora)
      path: "/admin",
      element: (
        /* Envolvido pelo PrivateRoute com onlyAdmin={true},
           exigindo login E permissão de administrador */
        <PrivateRoute onlyAdmin={true}>
          <HomeAdm />
        </PrivateRoute>
      ),
    },
    { 
      path: "*", 
      element: "",
    },
  ]);
  
  return routes;
}