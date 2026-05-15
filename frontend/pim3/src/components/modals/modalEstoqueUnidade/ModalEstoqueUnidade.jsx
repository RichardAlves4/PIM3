import React, { useState, useEffect } from "react";
import api from "../../../services/api.js";
import { EstoqueTable } from "../../estoqueTable/EstoqueTable.jsx";
import { ModalProduto } from "../modalProduto/ModalProduto.jsx";

import styles from "./modalEstoqueUnidade.module.css";

export function ModalEstoqueUnidade({ isOpen, onClose, franquia }) {

  // Estado para armazenar os itens de estoque originais retornados pela API
  const [itens, setItens] = useState([]);

  // Estados para gerenciar as strings de busca textual e seleção de categoria por filtro
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  // Estado de controle para renderização condicional de feedback visual de carregamento
  const [loading, setLoading] = useState(false);
  
  // Estados de controle para abrir e injetar dados no segundo nível de modal (ModalProduto)
  const [modalAberto, setModalAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);

  /**
   * Função assíncrona responsável por buscar na API os dados de inventário 
   * filtrando diretamente pelo ID da franquia contextualizada.
   */
  const carregarEstoque = async () => {
    setLoading(true); // Ativa o texto de feedback visual antes da requisição
    try {
      const res = await api.get(`/Estoques/Propriedade/${franquia.id}`);
      setItens(res.data); // Salva os itens retornados no estado
    } catch (error) {
      console.error("Erro ao carregar estoque:", error);
    } finally {
      setLoading(false); // Desativa o feedback visual independentemente do sucesso ou falha
    }
  };

  /**
   * Efeito colateral de Sincronização:
   * Sempre que este modal for aberto e houver uma franquia válida nas propriedades, 
   * ele limpa os filtros anteriores e dispara uma nova busca de dados atualizada.
   */
  useEffect(() => {
    if (isOpen && franquia) {
      carregarEstoque();
      setBusca(""); // Limpa o campo de busca textual anterior
      setCategoriaFiltro(""); // Reseta a seleção de categoria para o padrão global
    }
  }, [isOpen, franquia]);

  /**
   * Lógica de Filtragem Local (Client-side):
   * Filtra dinamicamente o array de itens original com base no texto digitado (case-insensitive) 
   * combinando-o de forma condicional com a categoria selecionada no seletor HTML.
   */
  const itensFiltrados = itens.filter((i) => {
    const matchesBusca = i.produto?.nome
      ?.toLowerCase()
      .includes(busca.toLowerCase());
    const matchesCategoria =
      categoriaFiltro === "" || i.produto?.categoria === categoriaFiltro;

    return matchesBusca && matchesCategoria;
  });

  /**
   * Extração Dinâmica de Categorias Únicas:
   * Varre a lista de itens mapeando as categorias existentes e utiliza a estrutura 'Set' 
   * para eliminar duplicatas automaticamente, gerando as opções do seletor de filtros.
   */
  const categoriasUnicas = [
    ...new Set(itens.map((i) => i.produto?.categoria)),
  ].filter(Boolean); // .filter(Boolean) remove quaisquer valores nulos ou indefinidos da lista

  // Cláusula de salvaguarda: Impede que a marcação HTML seja processada ou inserida no DOM se o modal estiver fechado
  if (!isOpen) return null;

  return (
    <div className={styles.container}>
      {/* Botão de escape rápido do modal principal */}
      <button onClick={onClose} className={styles.closeButton}>
        X
      </button>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Estoque: {franquia?.nome}</h2>
        </div>

        {/* Botão para adicionar novos itens: Garante que 'itemSelecionado' seja limpo antes do modal abrir */}
        <div className={styles.buttonContainer}>
          <button
            className={styles.button}
            onClick={() => {
              setItemSelecionado(null); // Define como nulo para indicar o Modo de Criação no formulário
              setModalAberto(true);
            }}
          >
            + Novo Produto
          </button>
        </div>

        {/* Seção superior contendo as interfaces de filtros e buscas */}
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
            {/* Mapeia a lista de categorias únicas extraídas para renderizar os seletores do filtro */}
            {categoriasUnicas.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Área de conteúdo: Renderiza condicionalmente a mensagem de progresso ou a tabela populada */}
        <div className={styles.content}>
          {loading ? (
            <p>Carregando estoque...</p>
          ) : (
            <EstoqueTable
              itens={itensFiltrados} // Passa os resultados calculados e filtrados localmente
              onEdit={(item) => {
                setItemSelecionado(item); // Alimenta o estado com o produto escolhido para Modo Edição
                setModalAberto(true);
              }}
              onDelete={async (id) => {
                // Interceptador nativo de segurança antes de realizar uma operação destrutiva
                if (
                  window.confirm(
                    "Tem certeza que deseja excluir este item do estoque?",
                  )
                ) {
                  try {
                    await api.delete(`/Estoques/${id}`);
                    alert("Item removido com sucesso!");
                    carregarEstoque(); // Re-sincroniza a tabela local buscando os dados mais recentes na API
                  } catch (error) {
                    console.error("Erro ao deletar:", error);
                    alert("Erro ao excluir o item.");
                  }
                }
              }}
            />
          )}
        </div>

        {/* Segundo nível de Modal: Formulário inteligente compartilhado para Criar ou Editar itens de estoque */}
        <ModalProduto
          isOpen={modalAberto}
          onClose={() => setModalAberto(false)}
          produto={itemSelecionado}
          onSubmit={async (dados) => {
            try {
              // Estrutura o payload de envio convertendo valores numéricos e injetando o ID da franquia contextual
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
                // Se houver um item pré-selecionado na memória, aciona a rota de Edição (PUT)
                await api.put(`/Estoques/${itemSelecionado.id}`, payload);
                alert("Produto atualizado com sucesso!");
              } else {
                // Caso contrário, assume-se Modo de Inserção de um novo insumo (POST)
                await api.post("/Estoques", payload);
                alert("Produto criado com sucesso!");
              }
              setModalAberto(false); // Fecha o formulário secundário
              carregarEstoque(); // Atualiza instantaneamente a listagem local refletindo as modificações
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