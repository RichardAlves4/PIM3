import React from 'react'
import { FormLogin } from '../../components/formLogin/FormLogin'

import styles from './login.module.css'
import { Link } from 'react-router'

export function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.greenContainer}>
          <img src="./src/assets/logo.jpg" alt="personImg" className={styles.logoImg} width={150} height={150} />
          <h1>Acessar Conta</h1>
          <FormLogin/>
        </div>
    </div>
  )
}