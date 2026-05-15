import React from "react";
// Importação do hook de navegação do React Router para redirecionamento programático
import { useNavigate } from "react-router";

import styles from "./header.module.css";

export function Header() {
  // Inicialização do hook para permitir a mudança de página através de funções JavaScript
  const navigate = useNavigate();

  /**
   * Função responsável pelo processo de encerramento de sessão (Logout)
   */
  function handleLogout() {
    // 1. Limpa todas as chaves salvas no LocalStorage do navegador 
    // Isso remove o 'token_simulado', 'unidadeLogada' e 'isAdmin' de uma só vez
    localStorage.clear();
    
    // 2. Redireciona o usuário de volta para a tela de login (raiz '/')
    navigate("/");
  }

  return (
    <header className={styles.header}>
      {/* Exibição do logotipo da marca */}
      <img src="./src/assets/logo.jpg" alt="logo" />
      
      {/* Título comercial fixo do sistema */}
      <h1>Dimmy's Burger</h1>
      
      {/* Botão de escape que engatilha o processo de limpeza e saída */}
      <button className={styles.button} onClick={handleLogout}>
        Sair
      </button>
    </header>
  );
}
