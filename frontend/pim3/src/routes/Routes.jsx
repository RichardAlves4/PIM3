import React from 'react'
import { useRoutes } from 'react-router';
import { Layout } from '../pages/Layout';
import { Login } from '../pages/login/Login';
import { PrivateRoute } from './PrivateRoute';
import { HomeAdm } from '../pages/homeAdm/HomeAdm';
import { HomeUser } from '../pages/homeUser/HomeUser';

export function Routes() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Login /> },
      ],
    },

    {
      path: "/user",
      element: (
        <PrivateRoute>
          <HomeUser/>
        </PrivateRoute>
      ),
    },
    {
      path: "/admin",
      element: (
        <PrivateRoute onlyAdmin={true}>
          <HomeAdm/>
        </PrivateRoute>
      ),
    },
    // { path: "*", element: <NotFound /> },
  ]);

  return routes;
}