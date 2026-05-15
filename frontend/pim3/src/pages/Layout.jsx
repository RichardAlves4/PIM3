import React from 'react'
// O Outlet é o componente do React Router que indica onde as rotas filhas devem ser renderizadas
import { Outlet } from 'react-router'

/**
 * Componente de Layout.
 * Sua função principal em uma aplicação é envolver rotas protegidas ou 
 * definir elementos que se repetem em várias páginas (como Header ou Navbar).
 */
export function Layout() {
  return (
    <>
      {/* 
          O <Outlet/> funciona como um "espaço reservado" (placeholder).
          Quando uma rota filha deste Layout for acessada, o conteúdo dessa 
          rota será injetado exatamente neste local. 
      */}
      <Outlet/>
    </>
  )
}