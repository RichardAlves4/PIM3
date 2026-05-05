import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FranquiaRow } from '../../components/franquiaRow/FranquiaRow.jsx';
import { ModalFranquia } from '../../components/modalFranquia/ModalFranquia.jsx';
import styles from './homeAdm.module.css';

export function HomeAdm() {
  const [franquias, setFranquias] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtroUf, setFiltroUf] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);

  const carregarFranquias = async () => {
    const res = await api.get('/Propriedades'); // Sua rota do C#
    setFranquias(res.data);
  };

  useEffect(() => { carregarFranquias(); }, []);

  // Lógica de Busca e Filtro combinados
  const franquiasFiltradas = franquias.filter(f => 
    f.nome.toLowerCase().includes(busca.toLowerCase()) &&
    (filtroUf === '' || f.uf === filtroUf)
  );

  const handleDelete = async (id) => {
    if (window.confirm("Deseja excluir esta franquia?")) {
      await api.delete(`/Propriedades/${id}`);
      carregarFranquias();
    }
  };

  return (
    <div className={styles.container}>
      <h1>Franquias</h1>
      
      <div className={styles.headerActions}>
        <div className={styles.searchBar}>
          <input 
            type="text" 
            placeholder="Procure suas franquias aqui..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <select onChange={(e) => setFiltroUf(e.target.value)}>
            <option value="">Filtrar por UF</option>
            <option value="SP">SP</option>
            <option value="RJ">RJ</option>
          </select>
        </div>
        
        <button className={styles.btnNova} onClick={() => {setEditando(null); setModalAberto(true)}}>
          + Nova Franquia
        </button>
      </div>

      <div className={styles.lista}>
        {franquiasFiltradas.map(f => (
          <FranquiaRow 
            key={f.id} 
            franquia={f} 
            onDelete={handleDelete}
            onEdit={(franquia) => { setEditando(franquia); setModalAberto(true); }}
          />
        ))}
      </div>

      <ModalFranquia 
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        dadosIniciais={editando}
        onSubmit={async (dados) => {
          editando ? await api.put(`/Propriedades/${editando.id}`, dados) : await api.post('/Propriedades', dados);
          setModalAberto(false);
          carregarFranquias();
        }}
      />
    </div>
  );
}