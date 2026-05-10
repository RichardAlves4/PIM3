import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { FranquiaRow } from "../../components/franquiaRow/FranquiaRow.jsx";
import { ModalFranquia } from "../../components/modalFranquia/ModalFranquia.jsx";
import { Header } from "../../components/header/Header.jsx";
import { ModalEstoqueUnidade } from "../../components/modalEstoqueUnidade/ModalEstoqueUnidade.jsx";

import styles from "./homeAdm.module.css";

export function HomeAdm() {
  const [franquias, setFranquias] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroUf, setFiltroUf] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [modalEstoqueAberto, setModalEstoqueAberto] = useState(false);
  const [franquiaSelecionada, setFranquiaSelecionada] = useState(null);

  const carregarFranquias = async () => {
    const res = await api.get("/Propriedades"); // Sua rota do C#
    setFranquias(res.data);
  };

  useEffect(() => {
    carregarFranquias();
  }, []);

  // Lógica de Busca e Filtro combinados
  const franquiasFiltradas = franquias.filter(
    (f) =>
      f.nome.toLowerCase().includes(busca.toLowerCase()) &&
      (filtroUf === "" || f.uf === filtroUf),
  );

  const handleDelete = async (id) => {
    if (window.confirm("Deseja excluir esta franquia?")) {
      await api.delete(`/Propriedades/${id}`);
      carregarFranquias();
    }
  };

  const handleAbrirEstoque = (franquia) => {
    setFranquiaSelecionada(franquia);
    setModalEstoqueAberto(true);
  };

  return (
    <div className={styles.container}>
      <Header />
      <h1>Franquias</h1>

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
            {franquiasFiltradas.map((f) => (
              <FranquiaRow
                key={f.id}
                franquia={f}
                onDelete={handleDelete}
                onEdit={(franquia) => {
                  setEditando(franquia);
                  setModalAberto(true);
                }}
                onAbrirEstoque={handleAbrirEstoque}
              />
            ))}
          </tbody>
        </table>
      </div>
      <ModalEstoqueUnidade
        isOpen={modalEstoqueAberto}
        onClose={() => setModalEstoqueAberto(false)}
        franquia={franquiaSelecionada}
      />

      <ModalFranquia
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        dadosIniciais={editando}
        onSubmit={async (dados) => {
          const dadosComData = {
            ...dados,
            dataAbertura: editando
              ? editando.dataAbertura
              : new Date().toISOString(),
          };
          if (editando) {
            await api.put(`/Propriedades/${editando.id}`, dadosComData);
          } else {
            await api.post("/Propriedades", dadosComData);
          }
          setModalAberto(false);
          carregarFranquias();
        }}
      />
    </div>
  );
}
