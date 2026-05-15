import React from 'react'

// Importação do componente que faz com a lógica do formulário
import { FormLogin } from '../../components/formLogin/FormLogin'

// Importação da imagem de uma logotipo  
import logo from '../../assets/logo.jpg'

// Importação do CSS Modules para garantir que os estilos sejam escopados apenas a este componente
import styles from './login.module.css'

export function Login() {
  return (
    /* O container principal que geralmente ocupa a tela inteira ou define o contexto de alinhamento */
    <div className={styles.container}>
      {/* Um container interno que agrupa os elementos visuais centrais */}
      <div className={styles.greenContainer}>
        {/*Renderização do logotipo*/}
          <img src={logo} alt="logo" className={styles.logoImg} width={150} height={150} />
          {/* Título principal da página para acessibilidade e hierarquia visual */}
          <h1>Acessar Conta</h1>
          {/* Chamada do componente de formulário, separando a responsabilidade de 
             layout da responsabilidade de captura de dados */}
          <FormLogin/>
        </div>
    </div>
  )
}