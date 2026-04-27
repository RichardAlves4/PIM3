import React from 'react'
import { FormLogin } from '../../components/formLogin/FormLogin'

import styles from './login.module.css'

export function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.greenContainer}>
        <div className={styles.content}>
          <img src="/src/assets/person_img.png" alt="personImg" width={150} height={150} />
          <h1>Acessar Conta</h1>
          <FormLogin/>
        </div>
        </div>
    </div>
  )
}