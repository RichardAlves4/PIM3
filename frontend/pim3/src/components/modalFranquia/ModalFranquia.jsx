import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import styles from "./modalFranquia.module.css";

// Definição do Schema
const schema = yup.object({
  nome: yup.string().required("*Campo Obrigatório"),
  razaoSocial: yup.string().required("*Campo Obrigatório"),
  taxaRoyalties: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .typeError("Informe um número")
    .min(0, "Mínimo 0")
    .required("*Campo Obrigatório"),
  cnpj: yup
    .string()
    .required("*Campo Obrigatório")
    .matches(/^\d{14}$/, "O CNPJ deve conter 14 números"),
  senha: yup
    .string()
    .min(6, "Mínimo 6 caracteres")
    .required("*Campo Obrigatório"),
  uf: yup.string().required("*Obrigatório"),
});

export function ModalFranquia({ isOpen, onClose, onSubmit, dadosIniciais }) {
  const [mostrarSenha, setMostrarSenha] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: dadosIniciais || {},
  });

  useEffect(() => {
    if (isOpen) {
      reset(
        dadosIniciais || {
          nome: "",
          razaoSocial: "",
          taxaRoyalties: "",
          cnpj: "",
          senha: "",
          uf: "SP",
        },
      );
    }
  }, [isOpen, dadosIniciais, reset]);

  if (!isOpen) return null;

  return (
    <div className={styles.container}>
      <div className={styles.modalContent}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <h2>{dadosIniciais ? "Editar Franquia" : "Criar Franquia"}</h2>
          <div className={styles.fieldContent}>
            <label>Nome:</label>
            <input
              {...register("nome")}
              placeholder="Nome da Unidade"
              className={errors.nome ? styles.errorInput : styles.formInput}
            />
            {errors.nome && (
              <span className={styles.errorMessage}>{errors.nome.message}</span>
            )}
          </div>

          <div className={styles.fieldContent}>
            <label>Razão Social:</label>
            <input
              {...register("razaoSocial")}
              placeholder="Razão Social Ltda"
              className={
                errors.razaoSocial ? styles.errorInput : styles.formInput
              }
            />
            {errors.razaoSocial && (
              <span className={styles.errorMessage}>
                {errors.razaoSocial.message}
              </span>
            )}
          </div>

          <div className={styles.fieldContent}>
            <label>Taxa de Royalties:</label>
            <input
              {...register("taxaRoyalties")}
              placeholder="taxa Royalties em %"
              className={
                errors.taxaRoyalties ? styles.errorInput : styles.formInput
              }
            />
            {errors.taxaRoyalties && (
              <span className={styles.errorMessage}>
                {errors.taxaRoyalties.message}
              </span>
            )}
          </div>

          <div className={styles.fieldContent}>
            <label>Senha de Acesso:</label>
            <div className={styles.passwordWrapper}>
              <input
                type={mostrarSenha ? "text" : "password"} // Lógica aqui
                {...register("senha")}
                placeholder="Digite a senha da unidade"
                className={errors.senha ? styles.errorInput : styles.formInput}
              />

              <button
                type="button" // Importante: ser type="button" para não submeter o form
                className={styles.eyeButton}
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                {mostrarSenha ? "👁️" : "🙈"}{" "}
                {/* Pode usar ícones do Lucide-React ou FontAwesome */}
              </button>
            </div>

            {errors.senha && (
              <span className={styles.errorMessage}>
                {errors.senha.message}
              </span>
            )}
          </div>

          <div className={styles.doubleFieldContainer}>
            <div className={styles.doubleFieldContent}>
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
                      onChange(values.value);
                    }}
                    className={
                      errors.cnpj ? styles.errorInput : styles.formInput
                    }
                  />
                )}
              />
              {errors.cnpj && (
                <span className={styles.errorMessage}>
                  {errors.cnpj.message}
                </span>
              )}
            </div>
            <div className={styles.doubleFieldContent}>
              <label>UF:</label>
              <select
                {...register("uf")}
                className={errors.uf ? styles.errorInput : styles.formInput}
              >
                <option value="">Selecione...</option>
                <option value="SP">São Paulo</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="MG">Minas Gerais</option>
              </select>
              {errors.uf && (
                <span className={styles.errorMessage}>{errors.uf.message}</span>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.btnSubmit}>
              {dadosIniciais ? "Salvar Alterações" : "Cadastrar Franquia"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.btnCancel}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
