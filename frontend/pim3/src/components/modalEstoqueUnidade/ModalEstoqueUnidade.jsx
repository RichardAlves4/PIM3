import React, { useState, useEffect } from "react";
import api from "../../services/api.js";
import { EstoqueTable } from "../estoqueTable/EstoqueTable.jsx";
import styles from "./modalEstoqueUnidade.module.css"; 

export function ModalEstoqueUnidade({ isOpen, onClose, franquia }) {
  const [itens, setItens] = useState([]);
  const [busca, setBusca] = useState(""); // Estado para busca
  const [categoriaFiltro, setCategoriaFiltro] = useState(""); // Estado para categoria
  const [loading, setLoading] = useState(false);

  const carregarEstoque = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/Estoques/Propriedade/${franquia.id}`);
      setItens(res.data);
    } catch (error) {
      console.error("Erro ao carregar estoque:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && franquia) {
      carregarEstoque();
      // Reseta os filtros ao abrir um novo modal de franquia diferente
      setBusca("");
      setCategoriaFiltro("");
    }
  }, [isOpen, franquia]);

  // Lógica de Filtro idêntica à sua HomeUser
  const itensFiltrados = itens.filter((i) => {
    const matchesBusca = i.produto?.nome
      ?.toLowerCase()
      .includes(busca.toLowerCase());
    const matchesCategoria =
      categoriaFiltro === "" || i.produto?.categoria === categoriaFiltro;

    return matchesBusca && matchesCategoria;
  });

  // Gera a lista de categorias únicas para o Select
  const categoriasUnicas = [...new Set(itens.map((i) => i.produto?.categoria))].filter(Boolean);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Estoque: {franquia?.nome}</h2>
          <button onClick={onClose} className={styles.btnClose}>&times;</button>
        </div>

        {/* Barra de Filtros dentro do Modal */}
        <div className={styles.filtersContainer}>
          <input
            className={styles.searchInput}
            placeholder="Buscar produto nesta franquia..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            type="search"
          />

          <select
            className={styles.selectInput}
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            <option value="">Todas as Categorias</option>
            {categoriasUnicas.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.content}>
          {loading ? (
            <p>Carregando estoque...</p>
          ) : (
            <EstoqueTable 
              itens={itensFiltrados} // Passa a lista filtrada
              onDelete={async (id) => {
                if (window.confirm("Remover este item?")) {
                  await api.delete(`/Estoques/${id}`);
                  carregarEstoque();
                }
              }}
              onEdit={() => {}} 
            />
          )}
        </div>
      </div>
    </div>
  );
}