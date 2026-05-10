import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "./modalProduto.module.css";

const schema = yup
  .object({
    nome: yup.string().required("O nome é obrigatório"),
    quantidadeAtual: yup
      .number()
      .transform((value, originalValue) => (originalValue === "" ? 0 : value))
      .typeError("Informe um número")
      .min(0, "Mínimo 0"),
    minimoSugerido: yup
      .number()
      .transform((value, originalValue) => (originalValue === "" ? 0 : value))
      .typeError("Informe um número")
      .min(0, "Mínimo 0"),
    unidade: yup.string().required("Selecione a unidade"),
    categoria: yup.string().required("Selecione a categoria"),
    dataFabricacao: yup
      .date()
      .nullable()
      .notRequired()
      .typeError("Data inválida"),
    validade: yup.date().nullable().notRequired().typeError("Data inválida"),
  })
  .required();

export function ModalProduto({ isOpen, onClose, onSubmit, produto }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: produto || { unidade: "Kg", categoria: "carnes" },
  });

  React.useEffect(() => {
    if (produto) {
      reset({
        nome: produto.produto?.nome,
        quantidadeAtual: produto.quantidadeAtual,
        minimoSugerido: produto.minimoSugerido,
        unidade: produto.unidade,
        categoria: produto.produto?.categoria || "carnes",
        dataFabricacao: produto.dataFabricacao
          ? produto.dataFabricacao.split("T")[0]
          : "",
        validade: produto.validade ? produto.validade.split("T")[0] : "",
      });
    } else {
      reset({
        nome: "",
        quantidadeAtual: 0,
        minimoSugerido: 0,
        unidade: "Kg",
        categoria: "carnes",
        dataFabricacao: "",
        validade: "",
      });
    }
  }, [produto, reset, isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  
  if (!isOpen) return null;

  return (
    <div className={styles.container}>
      <div className={styles.modalContent}>
        <h2>{produto ? "Editar Produto" : "Novo Produto"}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.fieldContent}>
            <label>Nome do Produto:</label>
            <input
              {...register("nome")}
              className={errors.nome ? styles.errorInput : styles.formInput}
            />
            {errors.nome && (
              <span className={styles.errorMessage}>{errors.nome.message}</span>
            )}
          </div>

          <div className={styles.doubleFieldContainer}>
            <div className={styles.doubleFieldContent}>
              <label>Qtd. Atual:</label>
              <input
                type="number"
                {...register("quantidadeAtual")}
                className={
                  errors.quantidadeAtual ? styles.errorInput : styles.formInput
                }
              />
              {errors.quantidadeAtual && (
                <span className={styles.errorMessage}>
                  {errors.quantidadeAtual.message}
                </span>
              )}
            </div>

            <div className={styles.doubleFieldContent}>
              <label>Unidade:</label>
              <select
                {...register("unidade")}
                className={
                  errors.unidade ? styles.errorInput : styles.formInput
                }
              >
                <option value="Kg">Kg</option>
                <option value="Unid">Unid</option>
                <option value="L">L</option>
              </select>
              {errors.unidade && (
                <span className={styles.errorMessage}>
                  {errors.unidade.message}
                </span>
              )}
            </div>
          </div>

          <div className={styles.fieldContent}>
            <label>Mínimo Sugerido:</label>
            <input
              type="number"
              {...register("minimoSugerido")}
              className={
                errors.minimoSugerido ? styles.errorInput : styles.formInput
              }
            />
            {errors.minimoSugerido && (
              <span className={styles.errorMessage}>
                {errors.minimoSugerido.message}
              </span>
            )}
          </div>

          <div className={styles.fieldContent}>
            <label>Categoria:</label>
            <select
              {...register("categoria")}
              className={
                errors.categoria ? styles.errorInput : styles.formInput
              }
            >
              <option value="Bebidas">Bebidas</option>
              <option value="Carnes">Carnes</option>
              <option value="Frutas">Frutas</option>
              <option value="Pães">Pães</option>
              <option value="Legumes">Legumes</option>
              <option value="Molhos">Molhos</option>
              <option value="Sobremesas">Sobremesas</option>
              <option value="Vegetais">Vegetais</option>
            </select>
            {errors.categoria && (
              <span className={styles.errorMessage}>
                {errors.categoria.message}
              </span>
            )}
          </div>

          <div className={styles.doubleFieldContainer}>
            <div className={styles.doubleFieldContent}>
              <label>Fabricação:</label>
              <input
                type="date"
                {...register("dataFabricacao")}
                className={
                  errors.dataFabricacao ? styles.errorInput : styles.formInput
                }
              />
              {errors.dataFabricacao && (
                <span className={styles.errorMessage}>
                  {errors.dataFabricacao.message}
                </span>
              )}
            </div>

            <div className={styles.doubleFieldContent}>
              <label>Validade:</label>
              <input
                type="date"
                {...register("validade")}
                className={
                  errors.validade ? styles.errorInput : styles.formInput
                }
              />
              {errors.validade && (
                <span className={styles.errorMessage}>
                  {errors.validade.message}
                </span>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.btnSubmit}>
              {produto ? "Salvar Alterações" : "Cadastrar"}
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
