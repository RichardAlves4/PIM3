import React from 'react'
import { useRoutes } from 'react-router';
import { Layout } from '../pages/Layout';
import { Login } from '../pages/login/Login';
import { LandingPage } from '../pages/landingPage/LandingPage';
import { PrivateRoute } from './PrivateRoute';

export function Routes() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <LandingPage /> },
      ],
    },
    { path: "/login", element: <Login /> },

    {
      path: "/dashboard-franquia",
      element: (
        <PrivateRoute>
          {/* <DashboardFranquia /> */}
        </PrivateRoute>
      ),
    },
    {
      path: "/admin",
      element: (
        <PrivateRoute onlyAdmin={true}>
          {/* <Admin /> */}
        </PrivateRoute>
      ),
    },
    // { path: "*", element: <NotFound /> },
  ]);

  return routes;
}