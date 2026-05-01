import React from 'react'
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import styles from './formLogin.module.css'

const schama = yup.object({
  userAccess: yup
  .string()
  .required("*Campo Obrigatório")
  .typeError("Usuário Inválido"),
  password: yup
  .string()
  .required("*Campo Obrigatório")
  .typeError("Senha Inválido"),
});

const onSubmit = async (data) => {
  try {
    const response = await api.get('/Propriedades'); 
    const unidades = response.data;

    const usuarioEncontrado = unidades.find(u => u.nome === data.userAccess && data.password === "123mudar");

    if (usuarioEncontrado) {
      localStorage.setItem("unidadeLogada", JSON.stringify(usuarioEncontrado));
      localStorage.setItem("isAdmin", usuarioEncontrado.ehFranqueadora ? "true" : "false");
      
      localStorage.setItem("token_simulado", "logado_com_sucesso");

      alert(`Bem-vindo, ${usuarioEncontrado.nome}!`);
      window.location.href = usuarioEncontrado.ehFranqueadora ? "/admin" : "/dashboard-franquia";
    } else {
      alert("Usuário não encontrado ou senha padrão incorreta!");
    }
  } catch (error) {
    console.error("Erro ao validar login:", error);
  }
};

export function FormLogin() {
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      userAccess: "",
      password: "",
    },
    resolver: yupResolver(schama),
  });

  const onSubmit = (data) => {
    reset();
  };

  return (
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="userAccess">Usuário:</label>
          <input
            type="text"
            placeholder="Usuário"
            name='userAccess'
            {...register("userAccess")}/>
          {errors.userAccess && (
            <span className={styles.error}>{errors.userAccess.message}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            placeholder="Senha"
            {...register("password")}/>
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}
        </div>

        "ChangePass"

        <button type="submit" disabled={isSubmitting} className={styles.button}>
          {isSubmitting ? "Enviando..." : "Entrar"}
        </button>
      </form>
  )
}