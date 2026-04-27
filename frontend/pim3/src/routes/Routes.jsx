import React from 'react'
import { useRoutes } from 'react-router';
import { Layout } from '../pages/Layout';

export function Routes() {
  const routes = useRoutes ([
    {
      path:'/',
      element:<Layout/>,
      children: [
            {index: true, element: <Layout/>}
      ]}
  ])
  return routes;
}