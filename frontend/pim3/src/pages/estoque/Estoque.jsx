import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { EstoqueTable } from '../../components/estoqueTable/EstoqueTable.jsx';
import { ModalProduto } from '../../components/ModalProduto/ModalProduto.jsx';

export function Estoque() {
    const [itens, setItens] = useState([]);
    const [busca, setBusca] = useState('');
    const [modalAberto, setModalAberto] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState(null);

    // Pega o ID da unidade logada (Franquia ou Admin auditando)
    const unidade = JSON.parse(localStorage.getItem("unidadeLogada"));

    const carregarEstoque = async () => {
        // Filtra no SQL Server apenas o estoque desta unidade
        const res = await api.get(`/Estoques/Propriedade/${unidade.id}`);
        setItens(res.data);
    };

    useEffect(() => { carregarEstoque(); }, []);

    const itensFiltrados = itens.filter(i =>
        i.produto?.nome?.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div className="container">
            <header className="headerEstoque">
                <input
                    placeholder="Procure seus produtos aqui..."
                    onChange={(e) => setBusca(e.target.value)}
                />
                <button onClick={() => { setItemSelecionado(null); setModalAberto(true); }}>
                    + Novo Produto
                </button>
            </header>

            <EstoqueTable
                itens={itensFiltrados}
                onEdit={(item) => { setItemSelecionado(item); setModalAberto(true); }}
                onDelete={async (id) => { /* lógica de delete */ }}
            />

            <ModalProduto
                isOpen={modalAberto}
                onClose={() => setModalAberto(false)}
                produto={itemSelecionado}
                onSubmit={async (dados) => {
                    try {
                        console.log("Valores que saíram do Modal:", dados);
                        const payload = {
                            // Mapeamento para a tabela 'Produtos'
                            produto: {
                                nome: dados.nome,   // Verifique se no C# é 'Nome' ou 'nomeProduto'
                                categoria: dados.categoria,
                                unidadePeso: dados.unidade
                            },
                            // Mapeamento para a tabela 'Estoques'
                            quantidadeAtual: Number(dados.quantidadeAtual),
                            minimoSugerido: Number(dados.minimoSugerido),
                            unidade: dados.unidade,
                            dataFabricacao: dados.dataFabricacao,
                            validade: dados.validade,
                            propriedadeId: Number(unidade.id) 
                        };

                        if (itemSelecionado) {
                            await api.put(`/Estoques/${itemSelecionado.id}`, payload);
                            alert("Produto atualizado com sucesso!");
                        } else {
                            await api.post('/Estoques', payload);
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