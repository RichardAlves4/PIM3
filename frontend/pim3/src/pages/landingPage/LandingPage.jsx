import React from 'react'
import { ReasonCards } from '../../components/reasonCards/ReasonCards'
import { FormCadastro } from '../../components/formCadastro/FormCadastro'

import styles from './landingPage.module.css'

export function LandingPage() {
  return (
    <main className={styles.main}>
      <section className={styles.reasonCadastroContainer}>
        <div className={styles.reasonContainer}>
          <h1>Por que fazer parte da nossa rede de restaurantes?</h1>
          <ReasonCards/>
        </div>
        <div className={styles.cadastroContainer}>
          <h1>Torne-se um franquiado</h1>
          <FormCadastro/>
        </div>
      </section>

      <section className={styles.deliveryContainer}>
        <h1>Estamos nos principais aplicativos de entrega:</h1>
        <div className={styles.logoMarcasContainer}>
          <img src="./src/assets/ifood.png" alt="ifood" />
          <img src="./src/assets/keeta.png" alt="keeta" />
          <img src="./src/assets/99food.png" alt="99food" />
          <img src="./src/assets/ubereats.png" alt="ubereats" />
        </div>
      </section>
      <footer className={styles.footer}>
        <p>© Copyright 2025. Todos os direitos reservados. Dimmy’s Burger</p>
      </footer>
    </main>
  )
}