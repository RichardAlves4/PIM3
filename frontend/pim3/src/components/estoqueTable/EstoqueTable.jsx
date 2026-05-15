import React from "react";

import styles from "./estoqueTable.module.css";

export function EstoqueTable({ itens, onEdit, onDelete }) {
  /**
   * Função auxiliar de lógica visual:
   * Define o rótulo e a cor do indicador de status de cada produto.
   */
  const definirStatus = (atual, minimo) => {
    // Caso a quantidade esteja zerado ou negativo
    if (atual <= 0) return { classe: "vazio", cor: "#e74c3c" }; // Vermelho
    // Caso a quantidadee esteja igual ou abaixo do limite de segurança definido
    if (atual <= minimo) return { classe: "baixo", cor: "#f1c40f" }; // Amarelo
    // Caso a quantidade esteja acima do mínimo sugerido
    return { classe: "bom", cor: "#27ae60" }; // Verde
  };

  return (
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Quantidade Atual</th>
            <th>Mínimo Sugerido</th>
            <th>Data Fabricacao</th>
            <th>Validade</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapeamento do array de itens para gerar as linhas da tabela dinamicamente */}
          {itens.map((item) => {
            // Calcula o status específico para cada linha durante a renderização
            const status = definirStatus(
              item.quantidadeAtual,
              item.minimoSugerido,
            );
            
            return (
              <tr key={item.id}>
                {/* Acesso seguro ao nome do produto (evita erro se produto for undefined) */}
                <td>{item.produto?.nome}</td>
                
                {/* Exibição de valores numéricos acompanhados da unidade (ex: 10 Kg) */}
                <td>
                  {item.quantidadeAtual} {item.unidade}
                </td>
                <td>
                  {item.minimoSugerido} {item.unidade}
                </td>
                
                {/* Formatação de datas para o padrão brasileiro. 
                    Verifica se a data existe antes de tentar converter */}
                <td>
                  {item.dataFabricacao
                    ? new Date(item.dataFabricacao).toLocaleDateString("pt-BR")
                    : "-"}
                </td>
                <td>
                  {item.validade
                    ? new Date(item.validade).toLocaleDateString("pt-BR")
                    : "-"}
                </td>
                
                {/* Renderização do indicador visual de status (quadrado colorido + texto) */}
                <td>
                  <div className={styles.statusContainer}>
                    <div
                      className={styles.statusSquare}
                      style={{ backgroundColor: status.cor }} // Aplicação dinâmica de cor
                    />
                    <span>{status.classe.toUpperCase()}</span>
                  </div>
                </td>

                {/* Coluna de Ações: Dispara as funções recebidas do componente pai */}
                <td>
                  <button
                    onClick={() => onEdit(item)} // Passa o objeto completo para edição
                    className={styles.btnEditar}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(item.id)} // Passa apenas o ID para remoção
                    className={styles.btnRemover}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
  );
}