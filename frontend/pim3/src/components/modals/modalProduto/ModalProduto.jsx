import React from "react";

// Importação do hook para gerenciar o estado e ciclo de vida do formulário
import { useForm } from "react-hook-form";

// Ponte de comunicação para aplicar o esquema de validação do Yup no React Hook Form
import { yupResolver } from "@hookform/resolvers/yup";

// Biblioteca utilitária para validação e higienização de objetos
import * as yup from "yup";

import styles from "./modalProduto.module.css";

// Definição das regras de negócio e validações para os campos do formulário
const schema = yup
  .object({
    nome: yup.string().required("O nome é obrigatório"),
    quantidadeAtual: yup
      .number()
      // .transform intercepta a string vazia do input numérico e converte para 0, evitando falhas de cast
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
      .nullable() // Permite que o valor seja nulo caso não seja enviado
      .notRequired() // Torna o preenchimento opcional
      .typeError("Data inválida"),
    validade: yup.date().nullable().notRequired().typeError("Data inválida"),
  })
  .required();

/**
 * Componente ModalProduto
 * Funciona de forma dual: Criando um novo item ou populando dados para a Edição de um item existente.
 */
export function ModalProduto({ isOpen, onClose, onSubmit, produto }) {
  // Inicialização do useForm aplicando o motor de validação do Yup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    // Define valores fallback padrão caso 'produto' seja nulo (Modo de Criação)
    defaultValues: produto || { unidade: "Kg", categoria: "carnes" },
  });

  /**
   * Efeito de Sincronização de Dados:
   * Monitora alterações na prop 'produto' e no estado de abertura do modal.
   */
  React.useEffect(() => {
    if (produto) {
      // Modo Edição: Mapeia as propriedades recebidas do banco e injeta nos campos correspondentes
      reset({
        nome: produto.produto?.nome,
        quantidadeAtual: produto.quantidadeAtual,
        minimoSugerido: produto.minimoSugerido,
        unidade: produto.unidade,
        categoria: produto.produto?.categoria || "carnes",
        // O input do tipo 'date' do HTML exige o formato estrito YYYY-MM-DD. 
        // O .split("T")[0] isola a data removendo o carimbo de hora UTC.
        dataFabricacao: produto.dataFabricacao
          ? produto.dataFabricacao.split("T")[0]
          : "",
        validade: produto.validade ? produto.validade.split("T")[0] : "",
      });
    } else {
      // Modo Criação: Reseta todos os campos para os valores limpos/padrão
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

  /**
   * Efeito de UX/UI (Controle de Rolagem):
   * Trava a barra de rolagem do fundo do site quando o modal está aberto, 
   * evitando o comportamento de "scroll duplo".
   */
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Desativa a rolagem da página ao fundo
    } else {
      document.body.style.overflow = "auto"; // Reativa a rolagem
    }
    // Função de limpeza (cleanup): Garante que a rolagem seja restaurada se o componente for desmontado inesperadamente
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  
  // Cláusula de salvaguarda: Se o modal não estiver ativo, aborta a renderização poupando processamento no DOM
  if (!isOpen) return null;

  return (
    <div className={styles.container}>
      <div className={styles.modalContent}>
        {/* Título dinâmico baseado na intenção de uso do componente */}
        <h2>{produto ? "Editar Produto" : "Novo Produto"}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* Campo de texto livre para o nome */}
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

          {/* Agrupamento lado a lado de Quantidade e Unidade de medida */}
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

          {/* Campo numérico para controle de estoque mínimo de segurança */}
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

          {/* Caixa de seleção com opções pré-definidas de categorias de insumos */}
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

          {/* Agrupamento horizontal para controle de datas cronológicas do insumo */}
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

          {/* Botões inferiores de confirmação e escape */}
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