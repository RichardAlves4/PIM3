import React from 'react'
import { Link } from 'react-router'

import styles from "./header.module.css"

export function Header() {
  return (
    <header className={styles.header}>
      <img src="./src/assets/logo.jpg" alt="logo" />
      <h1>Dimmy's Burger</h1>
      <div className={styles.linkContainer}>
        <Link to='/login' className={styles.linkContent}>Entrar</Link>
      </div>

    </header>
  )
}