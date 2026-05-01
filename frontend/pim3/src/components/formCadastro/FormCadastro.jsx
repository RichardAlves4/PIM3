import React from 'react';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PatternFormat } from 'react-number-format';
import * as yup from "yup";
import api from '../../services/api'; // Ajuste o caminho para sua instância do Axios

import styles from './formCadastro.module.css';

const schema = yup.object({
  nome: yup.string().required("*O nome da unidade é obrigatório").min(3, "Mínimo 3 caracteres"),
  razaoSocial: yup.string().required("*A Razão Social é obrigatória"),
  cnpj: yup.string().required("*O CNPJ é obrigatório").length(14, "O CNPJ deve conter 14 números"),
  uf: yup.string().required("*O UF é obrigatório").length(2, "Use a sigla (ex: SP)"),
  taxaRoyalties: yup.number().transform((value) => (isNaN(value) ? undefined : value)).required("*Defina a taxa")
});

export function FormCadastro({ isOpen, onClose, onSuccess }) {
  const { control, handleSubmit, reset, register, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { nome: "", razaoSocial: "", cnpj: "", uf: "", taxaRoyalties: "" },
    resolver: yupResolver(schema),
  });

  if (!isOpen) return null; // Não renderiza nada se estiver fechado

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        ehFranqueadora: false, // Matriz geralmente já existe, novas são filiais
        dataAbertura: new Date().toISOString()
      };

      await api.post('/Propriedades', payload);
      alert("Unidade cadastrada com sucesso!");
      reset();
      onSuccess(); // Função para atualizar a lista de unidades na tela principal
      onClose();   // Fecha o modal
    } catch (error) {
      console.error("Erro na API:", error.response?.data);
      alert("Erro ao cadastrar. Verifique se o CNPJ já existe.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>Cadastrar Nova Franquia</h2>
          <button onClick={onClose} className={styles.closeBtn}>&times;</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="nome">Nome da Unidade (Fantasia):</label>
            <input id="nome" type="text" {...register("nome")} />
            {errors.nome && <span className={styles.error}>{errors.nome.message}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="razaoSocial">Razão Social:</label>
            <input id="razaoSocial" type="text" {...register("razaoSocial")} />
            {errors.razaoSocial && <span className={styles.error}>{errors.razaoSocial.message}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="cnpj">CNPJ:</label>
            <Controller
              name="cnpj"
              control={control}
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <PatternFormat
                  {...fieldProps}
                  format="##.###.###/####-##"
                  onValueChange={(values) => onChange(values.value)}
                  value={value}
                />
              )}
            />
            {errors.cnpj && <span className={styles.error}>{errors.cnpj.message}</span>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="uf">UF:</label>
              <input id="uf" type="text" maxLength="2" {...register("uf")} />
              {errors.uf && <span className={styles.error}>{errors.uf.message}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="taxaRoyalties">Royalties (%):</label>
              <input id="taxaRoyalties" type="number" step="0.01" {...register("taxaRoyalties")} />
              {errors.taxaRoyalties && <span className={styles.error}>{errors.taxaRoyalties.message}</span>}
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
            <button type="submit" disabled={isSubmitting} className={styles.button}>
              {isSubmitting ? "Salvando..." : "Cadastrar Unidade"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}