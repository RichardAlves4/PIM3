import React, { useState, useEffect } from "react";
import api from "../../services/api.js";
import { EstoqueTable } from "../../components/estoqueTable/EstoqueTable.jsx";
import { ModalProduto } from "../../components/modalProduto/ModalProduto.jsx";

import styles from "./homeUser.module.css";
import { Header } from "../../components/header/Header.jsx";

export function HomeUser() {
  const [itens, setItens] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);

  // Pega o ID da unidade logada (Franquia ou Admin auditando)
  const unidade = JSON.parse(localStorage.getItem("unidadeLogada"));

  const carregarEstoque = async () => {
    // Filtra no SQL Server apenas o estoque desta unidade
    const res = await api.get(`/Estoques/Propriedade/${unidade.id}`);
    setItens(res.data);
  };

  useEffect(() => {
    carregarEstoque();
  }, []);

  const itensFiltrados = itens.filter((i) => {
    const matchesBusca = i.produto?.nome
      ?.toLowerCase()
      .includes(busca.toLowerCase());
    const matchesCategoria =
      categoriaFiltro === "" || i.produto?.categoria === categoriaFiltro;

    return matchesBusca && matchesCategoria;
  });

  return (
    <div className={styles.container}>
      <Header />
      <h1 className={styles.title}>Estoque</h1>

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

      <div>
        <input
          placeholder="Procure seus produtos aqui..."
          onChange={(e) => setBusca(e.target.value)}
          type="search"
        />

        <select
          className={styles.selectInput}
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
        >
          <option value="">Todas as Categorias</option>
          {/* Aqui você pode mapear categorias únicas do seu array de itens */}
          {[...new Set(itens.map((i) => i.produto?.categoria))]
            .filter(Boolean)
            .map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
        </select>
      </div>

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
              // Recarrega a lista para atualizar a tabela na tela
              carregarEstoque();
            } catch (error) {
              console.error("Erro ao deletar:", error);
              alert("Erro ao excluir o item.");
            }
          }
        }}
      />

      <ModalProduto
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        produto={itemSelecionado}
        onSubmit={async (dados) => {
          try {
            console.log("Valores que saíram do Modal:", dados);
            const payload = {
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
              propriedadeId: Number(unidade.id),
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
  );
}
