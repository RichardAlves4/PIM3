import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { FranquiaTable } from "../../components/franquiaTable/FranquiaTable.jsx";
import { ModalFranquia } from "../../components/modals/modalFranquia/ModalFranquia.jsx";
import { Header } from "../../components/header/Header.jsx";
import { ModalEstoqueUnidade } from "../../components/modals/modalEstoqueUnidade/ModalEstoqueUnidade.jsx";

import styles from "./homeAdm.module.css";

export function HomeAdm() {
  // Estado que armazena a lista completa de franquias trazidas do banco
  const [franquias, setFranquias] = useState([]);

  // Estados para capturar os filtros de busca por nome e por estado (UF)
  const [busca, setBusca] = useState("");
  const [filtroUf, setFiltroUf] = useState("");

  // Estados de controle para o Modal de Criação/Edição de franquias
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null); // Armazena a franquia em edição ou null se for criação

  // Estados de controle para o Modal de Auditoria de Estoque de uma franquia selecionada
  const [modalEstoqueAberto, setModalEstoqueAberto] = useState(false);
  const [franquiaSelecionada, setFranquiaSelecionada] = useState(null);

  /**
   * Chamada assíncrona ao servidor para listar todas as propriedades cadastradas.
   */
  const carregarFranquias = async () => {
    const res = await api.get("/Propriedades");
    setFranquias(res.data);
  };

  // Carrega os dados uma única vez assim que a tela do Administrador é montada
  useEffect(() => {
    carregarFranquias();
  }, []);

  /**
   * Filtragem em tempo real (Client-side):
   * Filtra a lista completa cruzando o nome digitado e a UF selecionada (se houver)
   */
  const franquiasFiltradas = franquias.filter(
    (f) =>
      f.nome.toLowerCase().includes(busca.toLowerCase()) &&
      (filtroUf === "" || f.uf === filtroUf),
  );

  /**
   * Handler para remoção de uma franquia.
   * Exibe um alerta nativo de confirmação antes de disparar o DELETE na API.
   */
  const handleDelete = async (id) => {
    if (window.confirm("Deseja excluir esta franquia?")) {
      await api.delete(`/Propriedades/${id}`);
      carregarFranquias(); // Recarrega a tabela após a exclusão
    }
  };

  /**
   * Handler disparado a partir da linha da tabela para abrir 
   * o modal de visualização do estoque específico daquela unidade.
   */
  const handleAbrirEstoque = (franquia) => {
    setFranquiaSelecionada(franquia);
    setModalEstoqueAberto(true);
  };

  return (
    <div className={styles.container}>
      <Header />
      <h1>Franquias</h1>

      {/* Botão de cadastro: Limpa o estado 'editando' para garantir que o formulário abra vazio */}
      <div className={styles.buttonContainer}>
        <button
          className={styles.button}
          onClick={() => {
            setEditando(null);
            setModalAberto(true);
          }}
        >
          + Nova Franquia
        </button>
      </div>

      {/* Seção de inputs e seletores para filtros de busca */}
      <div className={styles.filtersContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Buscar franquias..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select
          onChange={(e) => setFiltroUf(e.target.value)}
          className={styles.selectInput}
        >
          <option value="">Filtrar por UF</option>
          <option value="SP">São Paulo</option>
          <option value="RJ">Rio de Janeiro</option>
          <option value="MG">Minas Gerais</option>
        </select>
      </div>

      {/* Tabela de apresentação estruturada de dados */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>UF</th>
              <th>Razão Social</th>
              <th>CNPJ</th>
              <th>Royalties</th>
              <th>Abertura</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {/* Itera sobre os resultados filtrados mapeando cada um para o componente de linha */}
            {franquiasFiltradas.map((f) => (
              <FranquiaTable
                key={f.id}
                franquia={f} // Dados individuais da franquia
                onDelete={handleDelete}
                onEdit={(franquia) => {
                  // Preenche o estado com a franquia escolhida para habilitar o modo edição
                  setEditando(franquia);
                  setModalAberto(true);
                }}
                onAbrirEstoque={handleAbrirEstoque}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Modal responsável por mostrar o inventário exclusivo da franquia selecionada */}
      <ModalEstoqueUnidade
        isOpen={modalEstoqueAberto}
        onClose={() => setModalEstoqueAberto(false)}
        franquia={franquiaSelecionada}
      />

      {/* Modal inteligente compartilhado para inserção (POST) ou alteração (PUT) */}
      <ModalFranquia
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        dadosIniciais={editando}
        onSubmit={async (dados) => {
          // Prepara as informações estruturando a data de abertura do estabelecimento
          const payload = {
            ...dados,
            dataAbertura: editando
              ? editando.dataAbertura // Mantém a data antiga se for edição
              : new Date().toISOString(), // Gera uma data atualizada caso seja nova unidade
          };

          try {
            if (editando) {
              // Rota PUT se houver um objeto carregado em 'editando'
              await api.put(`/Propriedades/${editando.id}`, payload);
              alert("Franquia updated!");
            } else {
              // Rota POST se for um novo registro
              await api.post("/Propriedades", payload);
              alert("Franquia criada com a senha padrão: 123mudar");
            }

            setModalAberto(false); // Fecha o modal após o sucesso da operação
            carregarFranquias(); // Sincroniza a tela atualizando a lista de franquias
          } catch (error) {
            console.error("Erro ao salvar franquia:", error);
            alert("Erro ao salvar dados no banco.");
          }
        }}
      />
    </div>
  );
}