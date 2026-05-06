import React from 'react';
import styles from './estoqueTable.module.css';

export function EstoqueTable({ itens, onEdit, onDelete }) {
    const definirStatus = (atual, minimo) => {
        if (atual <= 0) return { classe: 'vazio', cor: '#e74c3c' };
        if (atual <= minimo) return { classe: 'baixo', cor: '#f1c40f' };
        return { classe: 'bom', cor: '#27ae60' };
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
                {itens.map((item) => {
                    const status = definirStatus(item.quantidadeAtual, item.minimoSugerido);
                    return (
                        <tr key={item.id}>
                            <td>{item.produto?.nome}</td>
                            <td>{item.quantidadeAtual} {item.unidade}</td>
                            <td>{item.minimoSugerido} {item.unidade}</td>
                            <td>{item.dataFabricacao ? new Date(item.dataFabricacao).toLocaleDateString('pt-BR') : '-'}</td>
                            <td>{item.validade ? new Date(item.validade).toLocaleDateString('pt-BR') : '-'}</td>
                            <td>
                                <div className={styles.statusContainer}>
                                    <div
                                        className={styles.statusSquare}
                                        // mudei de status.color para status.cor
                                        style={{ backgroundColor: status.cor }}
                                    />
                                    {/* mudei de status.label para status.classe (ou texto se preferir) */}
                                    <span>{status.classe.toUpperCase()}</span>
                                </div>
                            </td>
                            <td>
                                <button onClick={() => onEdit(item)} className={styles.btnEditar}>Editar</button>
                                <button onClick={() => onDelete(item.id)} className={styles.btnRemover}>Remover</button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}