import React from 'react'
import { useRoutes } from 'react-router';
import { Layout } from '../pages/Layout';
import { Login } from '../pages/login/Login';
import { LandingPage } from '../pages/landingPage/LandingPage';

export function Routes() {
  const routes = useRoutes ([
    {
      path:'/',
      element:<Layout/>,
      children: [
            {index: true, element: <LandingPage/>}
      ],
    },
    { path:"/login", element: <Login/>},
  ])
  return routes;
}