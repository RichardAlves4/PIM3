import React from 'react'
import { ReasonCards } from '../../components/reasonCards/ReasonCards'

import styles from './landingPage.module.css'
import { FormCadastro } from '../../components/formCadastro/FormCadastro'

export function LandingPage() {
  return (
    <main className={styles.main}>
      <section>
        <div className={styles.reason}>
          <h1>Por que fazer parte da nossa rede de restaurantes?</h1>
          <ReasonCards/>
        </div>
        <div>
          <h1>Torne-se um franquiado</h1>
          <FormCadastro/>
          
        </div>
      </section>
    </main>
  )
}