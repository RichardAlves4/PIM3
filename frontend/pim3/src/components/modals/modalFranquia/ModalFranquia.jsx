import React, { useEffect } from "react";

// useForm lida com o estado global do formulário; Controller estende o controle do ciclo de vida para componentes externos/customizados
import { useForm, Controller } from "react-hook-form";

// Componente de terceiro utilizado para mascarar e tratar a visualização estruturada de dados textuais ou numéricos
import { PatternFormat } from "react-number-format";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import styles from "./modalFranquia.module.css";

// Definição do esquema de dados exigido pela API da franqueadora
const schema = yup.object({
  nome: yup.string().required("*Campo Obrigatório"),
  razaoSocial: yup.string().required("*Campo Obrigatório"),
  taxaRoyalties: yup
    .number()
    // Intercepta e converte strings vazias ou caracteres inválidos para 'undefined' impedindo erros nativos de cast de tipo
    .transform((value) => (isNaN(value) ? undefined : value))
    .typeError("Informe um número")
    .min(0, "Mínimo 0")
    .required("*Campo Obrigatório"),
  cnpj: yup
    .string()
    .required("*Campo Obrigatório")
    // Expressão regular (Regex): Garante que a string limpa gravada no banco tenha exatamente 14 dígitos numéricos sequenciais
    .matches(/^\d{14}$/, "O CNPJ deve conter 14 números"),
  senha: yup
    .string()
    .min(6, "Mínimo 6 caracteres")
    .required("*Campo Obrigatório"),
  uf: yup.string().required("*Obrigatório"),
});

export function ModalFranquia({ isOpen, onClose, onSubmit, dadosIniciais }) {
  // Estado local booleano que altera o tipo do input de senha (password <-> text)
  const [mostrarSenha, setMostrarSenha] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control, // Objeto de referência necessário para alimentar as dependências do subcomponente <Controller />
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: dadosIniciais || {}, // Inicializa as propriedades do formulário baseando-se no objeto fornecido
  });

  /**
   * Efeito de sincronia de Ciclo de Vida:
   * Sempre que o modal for aberto ou o objeto 'dadosIniciais' mudar, o formulário é resetado.
   * Se for Edição, injeta as informações existentes. Se for Criação, limpa os campos deixando "SP" como UF padrão.
   */
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

  // Se o modal estiver invisível de acordo com o componente pai, impede a montagem e atualização de elementos filhos no DOM
  if (!isOpen) return null;

  return (
    <div className={styles.container}>
      <div className={styles.modalContent}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* Título contextual adaptado dinamicamente */}
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

          {/* Campo de senha customizado com botão de visibilidade */}
          <div className={styles.fieldContent}>
            <label>Senha de Acesso:</label>
            <div className={styles.passwordWrapper}>
              <input
                type={mostrarSenha ? "text" : "password"} // Altera dinamicamente o mascaramento do caractere digitado
                {...register("senha")}
                placeholder="Digite a senha da unidade"
                className={errors.senha ? styles.errorInput : styles.formInput}
              />
              <button
                type="button" // Tipo explicitado para que o clique não submeta acidentalmente o formulário HTML
                className={styles.eyeButton}
                onClick={() => setMostrarSenha(!mostrarSenha)} // Inverte o estado atual de visualização
              >
                {mostrarSenha ? "🙉" : "🙈"}{" "}
              </button>
            </div>

            {errors.senha && (
              <span className={styles.errorMessage}>
                {errors.senha.message}
              </span>
            )}
          </div>

          <div className={styles.doubleFieldContainer}>
            {/* Bloco Isolado do CNPJ com gerenciador controlado de máscaras estruturadas */}
            <div className={styles.doubleFieldContent}>
              <label htmlFor="cnpj">CNPJ:</label>
              <Controller
                name="cnpj"
                control={control}
                render={({ field: { onChange, value, ...fieldProps } }) => (
                  <PatternFormat
                    {...fieldProps}
                    format="##.###.###/####-##" // Máscara exibida na tela ao usuário
                    mask="_"
                    type="text"
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    value={value}
                    // Captura as alterações do input mascarado e passa adiante unicamente os dígitos crus (ex: 12345678000199)
                    onValueChange={(values) => {
                      onChange(values.value); // Salva no React Hook Form apenas os números limpos sem pontuação
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
