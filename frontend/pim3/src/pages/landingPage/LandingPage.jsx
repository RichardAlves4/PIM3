import React, { useState, useEffect } from 'react';
import { FormCadastro } from '../../components/formCadastro/FormCadastro'
import api from '../../services/api'; 

import styles from './landingPage.module.css'



export function LandingPage() {
  const [modalAberto, setModalAberto] = useState(false);
  const [unidades, setUnidades] = useState([]);

  // 1. Crie a função que o console disse que está faltando
  async function buscarUnidadesDoBanco() {
    try {
      const response = await api.get('/Propriedades'); // Endpoint do seu C#
      setUnidades(response.data);
    } catch (error) {
      console.error("Erro ao carregar unidades:", error);
    }
  }

  // 2. Carrega as unidades assim que a página abrir
  useEffect(() => {
    buscarUnidadesDoBanco();
  }, []);

  return (
    <div>
      <h1>Gestão de Franquias - Dimmy's Burger</h1>
      
      <button onClick={() => setModalAberto(true)}>
        Nova Unidade
      </button>

      {/* 3. Agora a função existe e pode ser passada para o Modal */}
      <FormCadastro 
        isOpen={modalAberto} 
        onClose={() => setModalAberto(false)} 
        onSuccess={buscarUnidadesDoBanco} 
      />

      {/* Lista para testar se está vindo do banco */}
      <ul>
        {unidades.map(u => (
          <li key={u.id}>{u.nome} - {u.cidade}</li>
        ))}
      </ul>
    </div>
  );
}