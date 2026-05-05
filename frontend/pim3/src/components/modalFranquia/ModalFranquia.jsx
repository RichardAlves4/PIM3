import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './Modal.module.css';

export function ModalFranquia({ isOpen, onClose, onSubmit, dadosIniciais }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: dadosIniciais || {}
  });

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{dadosIniciais ? 'Editar Franquia' : 'Criar Franquia'}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("nome")} placeholder="Nome" />
          <input {...register("razaoSocial")} placeholder="Razão Social" />
          <input {...register("cnpj")} placeholder="CNPJ" />
          
          <select {...register("uf")}>
            <option value="SP">SP</option>
            <option value="RJ">RJ</option>
            {/* Outros estados */}
          </select>

          <div className={styles.footer}>
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.btnSucesso}>
              {dadosIniciais ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}