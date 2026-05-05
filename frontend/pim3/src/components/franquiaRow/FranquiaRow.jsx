import React from 'react';
import { useNavigate } from 'react-router';
import styles from './franquiaRow.module.css';

export function FranquiaRow({ franquia, onDelete, onEdit }) {
  const navigate = useNavigate();

  // Lógica: se não houver referência de estoque no banco, mostra "Criar"
  const temEstoque = franquia.estoqueId != null;

  return (
    <div className={styles.row}>
      <span className={styles.nome}>{franquia.nome}</span>
      
      <div className={styles.actions}>
        <button 
          className={temEstoque ? styles.btnEstoque : styles.btnCriar}
          onClick={() => temEstoque ? navigate(`/estoque/${franquia.id}`) : navigate(`/criar-estoque/${franquia.id}`)}
        >
          {temEstoque ? "Estoque" : "Criar Estoque"}
        </button>
        
        <button onClick={() => onEdit(franquia)} className={styles.btnIcon}>✏️</button>
        <button onClick={() => onDelete(franquia.id)} className={styles.btnIcon}>🗑️</button>
      </div>
    </div>
  );
}