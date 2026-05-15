import React from "react";
import styles from './franquiaTable.module.css';

// Recebe via desestruturação de props o objeto com os dados da franquia e os callbacks de ação
export function FranquiaTable({ franquia, onDelete, onEdit, onAbrirEstoque }) {
  return (
    <tr>
      {/* Exibição direta dos dados cadastrais em formato de texto simples */}
      <td>{franquia.nome}</td>
      <td>{franquia.uf}</td>
      <td>{franquia.razaoSocial}</td>
      <td>{franquia.cnpj}</td>
      
      {/* Formatação visual da taxa adicionando o símbolo de porcentagem ao valor numérico */}
      <td>{franquia.taxaRoyalties}%</td>
      
      <td>
        {/* Avaliação condicional: Caso exista a string de data, faz o cast para o objeto Date 
            e formata no padrão brasileiro (DD/MM/AAAA). Caso contrário, exibe um traço como fallback */}
        {franquia.dataAbertura
          ? new Date(franquia.dataAbertura).toLocaleDateString("pt-BR")
          : "-"}
      </td>
      
      <td className={styles.actions}>
        {/* Botão de Auditoria: Dispara a abertura do modal repassando todo o objeto da franquia atual */}
        <button 
          className={styles.buttonEstoque} 
          onClick={() => onAbrirEstoque(franquia)}
          title="Ver Estoque"
        >
          Abrir Estoque
        </button>
        
        {/* Botão de Edição: Encaminha os dados da franquia para preencher o formulário no modal de edição */}
        <button 
          onClick={() => onEdit(franquia)} 
          className={styles.buttonEditar}
          title="Editar Franquia"
        >
          Editar
        </button>
        
        {/* Botão de Remoção: Passa exclusivamente o ID da franquia, isolando a informação 
            necessária para o comando DELETE da API no componente pai */}
        <button 
          onClick={() => onDelete(franquia.id)} 
          className={styles.buttonRemover}
          title="Excluir Franquia"
        >
          Excluir
        </button>
      </td>
    </tr>
  );
}