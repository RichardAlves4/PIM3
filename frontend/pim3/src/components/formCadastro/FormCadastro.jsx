import React from 'react'
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PatternFormat } from 'react-number-format';

import styles from './formCadastro.module.css'

const schama = yup.object({
  name: yup
    .string()
    .required("*O nome é obrigatório")
    .min(3, "O nome deve ter pelo menos 3 caracteres"),
  
  lastName: yup
    .string()
    .required("*O sobrenome é obrigatório"),
  
  email: yup
    .string()
    .email("*Digite um e-mail válido")
    .required("*O e-mail é obrigatório"),
  
  telefone: yup
    .string()
    .required("*O telefone é obrigatório")
    .matches(/^\d{10,11}$/, "Digite apenas números (com DDD)"),
  
  uf: yup
    .string()
    .required("*Selecione o UF")
    .length(2, "Use apenas a sigla (ex: SP)"),
  
  cidade: yup
    .string()
    .required("*A cidade é obrigatória"),
  
  quantoEsperaInvestir: yup
    .string()
    .required("*Selecione uma faixa de investimento")
});
2;

export function FormCadastro() {
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      telefone: "",
      uf: "",
      cidade: "",
      quantoEsperaInvestir: ""
    },
    resolver: yupResolver(schama), // Certifique-se que o nome da variável é 'schama' ou 'schema'
  });

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {/* NOME */}
      <div className={styles.field}>
        <label htmlFor="name">Nome:</label>
        <input
          id="name"
          type="text"
          placeholder="Digite seu nome..."
          {...register("name")}
        />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>

      {/* SOBRENOME */}
      <div className={styles.field}>
        <label htmlFor="lastName">Sobrenome:</label>
        <input
          id="lastName"
          type="text"
          placeholder="Digite seu sobrenome..."
          {...register("lastName")}
        />
        {errors.lastName && <span className={styles.error}>{errors.lastName.message}</span>}
      </div>

      {/* EMAIL */}
      <div className={styles.field}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          placeholder="Digite seu email..."
          {...register("email")}
        />
        {errors.email && <span className={styles.error}>{errors.email.message}</span>}
      </div>

      <div className={styles.field}>
  <label htmlFor="telefone">Telefone:</label>
  <Controller
    name="telefone"
    control={control}
    render={({ field: { onChange, value, ...fieldProps } }) => (
      <PatternFormat
        {...fieldProps}
        format="(##) #####-####"
        mask="_"
        type="tel"
        id="telefone"
        placeholder="(__) _____-____"
        value={value}
        onValueChange={(values) => {
          // values.value entrega apenas os números (ex: 11999998888)
          // Isso é ótimo para salvar no banco de dados depois!
          onChange(values.value); 
        }}
        className={errors.telefone ? styles.inputError : ""}
      />
    )}
  />
  {errors.telefone && <span className={styles.error}>{errors.telefone.message}</span>}
</div>

      {/* UF */}
      <div className={styles.field}>
        <label htmlFor="uf">UF:</label>
        <input
          id="uf"
          type="text"
          maxlength='2'
          placeholder="Ex: SP"
          {...register("uf")}
        />
        {errors.uf && <span className={styles.error}>{errors.uf.message}</span>}
      </div>

      {/* CIDADE */}
      <div className={styles.field}>
        <label htmlFor="cidade">Cidade:</label>
        <input
          id="cidade"
          type="text"
          placeholder="Digite sua cidade..."
          {...register("cidade")}
        />
        {errors.cidade && <span className={styles.error}>{errors.cidade.message}</span>}
      </div>

      {/* QUANTO ESPERA INVESTIR */}
      <div className={styles.field}>
        <label htmlFor="quantoEsperaInvestir">Quanto espera investir?:</label>
        <input
          id="quantoEsperaInvestir"
          type="text"
          placeholder="Ex: R$ 50.000,00"
          {...register("quantoEsperaInvestir")}
        />
        {errors.quantoEsperaInvestir && (
          <span className={styles.error}>{errors.quantoEsperaInvestir.message}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} className={styles.button}>
        {isSubmitting ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
}