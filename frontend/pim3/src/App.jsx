import React from 'react'

// Importação do gerenciador central de rotas que mapeia as URLs (ex: '/', '/home', '/adm') para suas respectivas telas
import { Routes } from './routes/Routes'

// Importação dos estilos CSS globais que afetam toda a estrutura base do site
import './App.css';

export function App() {
  return (
    <>
      {/* Fragmento do React (<></>): Usado para agrupar elementos sem injetar tags HTML adicionais (como uma <div>) desnecessárias no DOM */}
      
      {/* Injeção do componente de rotas: A partir daqui, o React Router assume o controle do que será renderizado na tela */}
      <Routes/>
    </>
  )
}