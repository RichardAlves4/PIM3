import React from "react";
import styles from './franquiaRow.module.css';

export function FranquiaRow({ franquia, onDelete, onEdit, onAbrirEstoque }) {
  return (
    <tr className={styles.row}>
      <td>{franquia.nome}</td>
      <td>{franquia.uf}</td>
      <td>{franquia.razaoSocial}</td>
      <td>{franquia.cnpj}</td>
      <td>{franquia.taxaRoyalties}%</td>
      <td>
        {franquia.dataAbertura
          ? new Date(franquia.dataAbertura).toLocaleDateString("pt-BR")
          : "-"}
      </td>
      <td className={styles.actions}>
        <button 
          className={styles.btnEstoque} 
          onClick={() => onAbrirEstoque(franquia)}
          title="Ver Estoque"
        >
          Abrir Estoque
        </button>
        <button 
          onClick={() => onEdit(franquia)} 
          className={styles.btnEditar}
          title="Editar Franquia"
        >
          Editar
        </button>
        <button 
          onClick={() => onDelete(franquia.id)} 
          className={styles.btnRemover}
          title="Excluir Franquia"
        >
          Excluir
        </button>
      </td>
    </tr>
  );
}