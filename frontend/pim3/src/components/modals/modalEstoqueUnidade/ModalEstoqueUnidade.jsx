import React, { useState, useEffect } from "react";
import api from "../../../services/api.js";
import { EstoqueTable } from "../../estoqueTable/EstoqueTable.jsx";
import { ModalProduto } from "../modalProduto/ModalProduto.jsx";

import styles from "./modalEstoqueUnidade.module.css";

export function ModalEstoqueUnidade({ isOpen, onClose, franquia }) {
  const [itens, setItens] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);

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
      setBusca("");
      setCategoriaFiltro("");
    }
  }, [isOpen, franquia]);

  const itensFiltrados = itens.filter((i) => {
    const matchesBusca = i.produto?.nome
      ?.toLowerCase()
      .includes(busca.toLowerCase());
    const matchesCategoria =
      categoriaFiltro === "" || i.produto?.categoria === categoriaFiltro;

    return matchesBusca && matchesCategoria;
  });

  const categoriasUnicas = [
    ...new Set(itens.map((i) => i.produto?.categoria)),
  ].filter(Boolean);

  if (!isOpen) return null;

  return (
    <div className={styles.container}>
      <button onClick={onClose} className={styles.closeButton}>
        X
      </button>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Estoque: {franquia?.nome}</h2>
        </div>

        <div className={styles.buttonContainer}>
          <button
            className={styles.button}
            onClick={() => {
              setItemSelecionado(null);
              setModalAberto(true);
            }}
          >
            + Novo Produto
          </button>
        </div>

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
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.content}>
          {loading ? (
            <p>Carregando estoque...</p>
          ) : (
            <EstoqueTable
              itens={itensFiltrados}
              onEdit={(item) => {
                setItemSelecionado(item);
                setModalAberto(true);
              }}
              onDelete={async (id) => {
                if (
                  window.confirm(
                    "Tem certeza que deseja excluir este item do estoque?",
                  )
                ) {
                  try {
                    await api.delete(`/Estoques/${id}`);
                    alert("Item removido com sucesso!");
                    carregarEstoque();
                  } catch (error) {
                    console.error("Erro ao deletar:", error);
                    alert("Erro ao excluir o item.");
                  }
                }
              }}
            />
          )}
        </div>

        <ModalProduto
          isOpen={modalAberto}
          onClose={() => setModalAberto(false)}
          produto={itemSelecionado}
          onSubmit={async (dados) => {
            try {
              const payload = {
                propriedadeId: Number(franquia.id),

                produto: {
                  nome: dados.nome,
                  categoria: dados.categoria,
                  unidadePeso: dados.unidade,
                },
                quantidadeAtual: Number(dados.quantidadeAtual),
                minimoSugerido: Number(dados.minimoSugerido),
                unidade: dados.unidade,
                dataFabricacao: dados.dataFabricacao,
                validade: dados.validade,
              };

              if (itemSelecionado) {
                await api.put(`/Estoques/${itemSelecionado.id}`, payload);
                alert("Produto atualizado com sucesso!");
              } else {
                await api.post("/Estoques", payload);
                alert("Produto criado com sucesso!");
              }
              setModalAberto(false);
              carregarEstoque();
            } catch (error) {
              console.error("Erro ao salvar produto:", error);
              alert("Erro ao salvar no banco de dados.");
            }
          }}
        />
      </div>
    </div>
  );
}
