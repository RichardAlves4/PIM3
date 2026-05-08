import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { PatternFormat } from "react-number-format";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import styles from './Modal.module.css';

// Definição do Schema
const schema = yup.object({
  nome: yup.string().required("*Campo Obrigatório"),
  razaoSocial: yup.string().required("*Campo Obrigatório"),
  cnpj: yup
    .string()
    .required("*Campo Obrigatório")
    .matches(/^\d{14}$/, "O CNPJ deve conter 14 números"),
  uf: yup.string().required("*Obrigatório"),
});

export function ModalFranquia({ isOpen, onClose, onSubmit, dadosIniciais }) {
  // Adicionado 'control' e 'formState: { errors }' que faltavam
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: dadosIniciais || {}
  });

  // Reseta o formulário sempre que os dados iniciais mudarem ou o modal abrir
  useEffect(() => {
    if (isOpen) {
      reset(dadosIniciais || { nome: '', razaoSocial: '', cnpj: '', uf: 'SP' });
    }
  }, [isOpen, dadosIniciais, reset]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{dadosIniciais ? 'Editar Franquia' : 'Criar Franquia'}</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formContent}>
          
          <div className={styles.field}>
            <label>Nome:</label>
            <input {...register("nome")} placeholder="Nome da Unidade" className={errors.nome ? styles.inputError : ""} />
            {errors.nome && <span className={styles.error}>{errors.nome.message}</span>}
          </div>

          <div className={styles.field}>
            <label>Razão Social:</label>
            <input {...register("razaoSocial")} placeholder="Razão Social Ltda" className={errors.razaoSocial ? styles.inputError : ""} />
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
                  mask="_"
                  type="text"
                  id="cnpj"
                  placeholder="00.000.000/0000-00"
                  value={value}
                  onValueChange={(values) => {
                    // Envia apenas os números para o formulário
                    onChange(values.value);
                  }}
                  className={errors.cnpj ? styles.inputError : ""}
                />
              )}
            />
            {errors.cnpj && <span className={styles.error}>{errors.cnpj.message}</span>}
          </div>

          <div className={styles.field}>
            <label>UF:</label>
            <select {...register("uf")} className={errors.uf ? styles.inputError : ""}>
              <option value="">Selecione...</option>
              <option value="SP">São Paulo</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="MG">Minas Gerais</option>
              {/* Adicione outros conforme necessário */}
            </select>
            {errors.uf && <span className={styles.error}>{errors.uf.message}</span>}
          </div>

          <div className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.btnCancelar}>Cancelar</button>
            <button type="submit" className={styles.btnSucesso}>
              {dadosIniciais ? 'Salvar Alterações' : 'Cadastrar Franquia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}