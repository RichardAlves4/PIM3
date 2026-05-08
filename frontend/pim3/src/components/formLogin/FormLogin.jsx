import React from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from '../../services/api'; // Garanta que a importação da API esteja aqui

import styles from './formLogin.module.css'

const schema = yup.object({
  userAccess: yup.string().required("*Campo Obrigatório"),
  password: yup.string().required("*Campo Obrigatório"),
});

export function FormLogin() {
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { userAccess: "", password: "" },
    resolver: yupResolver(schema),
  });

  // A LÓGICA DEVE FICAR AQUI DENTRO
  const realizarLogin = async (data) => {
    try {
      // Busca as unidades no SQL Server via sua API
      const response = await api.get('/Propriedades'); 
      const unidades = response.data;

      // Procura a unidade/franquia pelo nome
      const usuarioEncontrado = unidades.find(
        u => u.nome === data.userAccess && data.password === "123mudar"
      );

      if (usuarioEncontrado) {
        localStorage.setItem("unidadeLogada", JSON.stringify(usuarioEncontrado));
        localStorage.setItem("isAdmin", usuarioEncontrado.ehFranqueadora ? "true" : "false");
        localStorage.setItem("token_simulado", "logado_com_sucesso");

        alert(`Bem-vindo, ${usuarioEncontrado.nome}!`);
        
        // Redireciona dependendo se é Franqueadora ou Franquia
        window.location.href = usuarioEncontrado.ehFranqueadora ? "/admin" : "/user";
      } else {
        alert("Usuário não encontrado ou senha incorreta!");
      }
    } catch (error) {
      console.error("Erro ao validar login:", error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(realizarLogin)} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="userAccess">Usuário:</label>
        <input
          type="text"
          placeholder="Digite o nome da unidade"
          {...register("userAccess")}
        />
        {errors.userAccess && (
          <span className={styles.error}>{errors.userAccess.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="password">Senha:</label>
        <input
          type="password"
          placeholder="Sua senha"
          {...register("password")}
        />
        {errors.password && (
          <span className={styles.error}>{errors.password.message}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} className={styles.button}>
        {isSubmitting ? "Autenticando..." : "Entrar"}
      </button>
    </form>
  )
}