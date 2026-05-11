import React from 'react';
import { useForm } from "react-hook-form";
import api from '../../services/api';
import styles from './modalAlterarSenha.module.css';

export function ModalAlterarSenha({ isOpen, onClose }) {
  const { register, handleSubmit, reset } = useForm();

  const handleTrocarSenha = async (data) => {
    try {
      // 1. Busca todas as propriedades para encontrar a correta
      const res = await api.get('/Propriedades');
      const unidade = res.data.find(u => 
        u.nome.toLowerCase() === data.usuario.toLowerCase() && 
        u.cnpj === data.cnpj
      );

      if (!unidade) {
        alert("Dados de validação incorretos! Verifique o Nome e o CNPJ.");
        return;
      }

      // 2. Prepara o objeto completo para o PUT (o C# geralmente exige o objeto todo)
      const payload = {
        ...unidade,
        senha: data.novaSenha // Substitui pela nova
      };

      await api.put(`/Propriedades/${unidade.id}`, payload);

      alert("Senha alterada com sucesso! Agora você já pode logar.");
      reset();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Alterar Senha de Unidade</h2>
        <p>Valide os dados da sua franquia para prosseguir:</p>
        
        <form onSubmit={handleSubmit(handleTrocarSenha)}>
          <div className={styles.field}>
            <input {...register("usuario")} placeholder="Nome do Usuário/Unidade" required />
          </div>
          
          <div className={styles.field}>
            <input {...register("cnpj")} placeholder="CNPJ (apenas números)" required />
          </div>
          
          <div className={styles.field}>
            <input 
              {...register("novaSenha")} 
              type="password" 
              placeholder="Sua nova senha" 
              required 
            />
          </div>
          
          <div className={styles.actions}>
            <button type="submit" className={styles.btnConfirmar}>Atualizar Senha</button>
            <button type="button" onClick={onClose} className={styles.btnCancelar}>Sair</button>
          </div>
        </form>
      </div>
    </div>
  );
}