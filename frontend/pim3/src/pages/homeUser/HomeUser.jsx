import React, { useState, useEffect } from "react";
import api from "../../services/api.js";
import { EstoqueTable } from "../../components/estoqueTable/EstoqueTable.jsx";
import { ModalProduto } from "../../components/modals/modalProduto/ModalProduto.jsx";

import styles from "./homeUser.module.css";
import { Header } from "../../components/header/Header.jsx";

export function HomeUser() {
  // Estado que armazena a lista completa de itens vinda da API
  const [itens, setItens] = useState([]);
  // Estados para controlar os filtros de busca textual e categoria
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  // Controle do estado do Modal (aberto/fechado) e se há um item em edição
  const [modalAberto, setModalAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);

  // Recupera os dados da unidade (franquia) salvos no login para filtrar os dados na API
  const unidade = JSON.parse(localStorage.getItem("unidadeLogada"));

  /**
   * Função para buscar dados do backend.
   * Filtra os itens especificamente pelo ID da unidade logada.
   */
  const carregarEstoque = async () => {
    const res = await api.get(`/Estoques/Propriedade/${unidade.id}`);
    setItens(res.data);
  };

  // Carrega os dados assim que o componente é montado na tela
  useEffect(() => {
    carregarEstoque();
  }, []);

  /**
   * Lógica de Filtragem (Client-side):
   * Filtra a lista 'itens' baseada no que o usuário digita ou seleciona.
   */
  const itensFiltrados = itens.filter((i) => {
    // Verifica se o nome do produto contém o texto da busca (ignora maiúsculas/minúsculas)
    const matchesBusca = i.produto?.nome
      ?.toLowerCase()
      .includes(busca.toLowerCase());
    // Verifica se a categoria bate ou se o filtro de categoria está vazio (mostrar todos)
    const matchesCategoria =
      categoriaFiltro === "" || i.produto?.categoria === categoriaFiltro;

    return matchesBusca && matchesCategoria;
  });

  return (
    <div className={styles.container}>
      <Header />  
      <h1 className={styles.title}>Estoque</h1>

      {/* Botão para adicionar novo produto - Reseta o item selecionado para o modal vir vazio */}
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

      {/* Seção de Filtros */}
      <div className={styles.filtersContainer}>
        <input
          className={styles.searchInput}
          placeholder="Buscar produtos..."
          onChange={(e) => setBusca(e.target.value)}
          type="search"
        />

        {/* Select de categorias gerado dinamicamente a partir dos itens existentes */}
        <select
          className={styles.selectInput}
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
        >
          <option value="">Todas as Categorias</option> 
          {/* Cria um Set para garantir categorias únicas na lista de opções */}
          {[...new Set(itens.map((i) => i.produto?.categoria))]
            .filter(Boolean)
            .map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
        </select>
      </div>

      {/* Tabela de Exibição dos Dados */}
      <div className={styles.tableWrapper}>
        <EstoqueTable
          itens={itensFiltrados}
          // Ao clicar em editar, popula o estado com o item para o modal abrir com dados
          onEdit={(item) => {
            setItemSelecionado(item);
            setModalAberto(true);
          }}
          // Lógica de exclusão com confirmação nativa do navegador
          onDelete={async (id) => {
            if (
              window.confirm(
                "Tem certeza que deseja excluir este item do estoque?",
              )
            ) {
              try {
                await api.delete(`/Estoques/${id}`);
                alert("Item removido com sucesso!");
                carregarEstoque(); // Atualiza a lista após deletar
              } catch (error) {
                console.error("Erro ao deletar:", error);
                alert("Erro ao excluir o item.");
              }
            }
          }}
        />
      </div>

      {/* Modal para Criação ou Edição de Produtos */}
      <ModalProduto
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        produto={itemSelecionado} // Passa o item se for edição, ou null se for novo
        onSubmit={async (dados) => {
          try {
            // Mapeamento dos dados do formulário para o formato esperado pelo Banco de Dados
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

            // Decide entre atualizar (PUT) ou criar (POST) baseado na existência do itemSelecionado
            if (itemSelecionado) {
              await api.put(`/Estoques/${itemSelecionado.id}`, payload);
              alert("Produto atualizado com sucesso!");
            } else {
              await api.post("/Estoques", payload);
              alert("Produto criado com sucesso!");
            }

            setModalAberto(false);
            carregarEstoque(); // Recarrega a lista para mostrar as mudanças
          } catch (error) {
            console.error("Erro ao salvar produto:", error);
            alert("Erro ao salvar no banco de dados.");
          }
        }}
      />
    </div>
  );
}