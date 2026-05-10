import React from "react";
import { useNavigate } from "react-router";

import styles from "./header.module.css";

export function Header() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <header className={styles.header}>
      <img src="./src/assets/logo.jpg" alt="logo" />
      <h1>Dimmy's Burger</h1>
      <button className={styles.button} onClick={handleLogout}>
        Sair
      </button>
    </header>
  );
}
