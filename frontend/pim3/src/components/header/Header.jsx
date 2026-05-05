import React from 'react'

import styles from "./header.module.css"

export function Header() {
  return (
    <header className={styles.header}>
      <img src="./src/assets/logo.jpg" alt="logo" />
      <h1>Dimmy's Burger</h1>
      <button className={styles.linkContainer}>Sair</button>
      

    </header>
  )
}