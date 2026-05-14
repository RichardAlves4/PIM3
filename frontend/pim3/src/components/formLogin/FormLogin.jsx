import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../services/api";
import { ModalAlterarSenha } from "../modals/modalAlterarSenha/ModalAlterarSenha.jsx";

import styles from "./formLogin.module.css";

const schema = yup.object({
  userAccess: yup.string().required("*Campo Obrigatório"),
  password: yup.string().required("*Campo Obrigatório"),
});

export function FormLogin() {
  const [open, setOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { userAccess: "", password: "" },
    resolver: yupResolver(schema),
  });

  const realizarLogin = async (data) => {
    try {
      const response = await api.get("/Propriedades");
      const propriedades = response.data;

      const authentication = propriedades.find(
        (pro) => pro.nome === data.userAccess && pro.senha === data.password,
      );

      if (authentication) {
        localStorage.setItem(
          "unidadeLogada",
          JSON.stringify(authentication),
        );
        localStorage.setItem(
          "isAdmin",
          authentication.ehFranqueadora ? "true" : "false",
        );
        localStorage.setItem("token_simulado", "logado_com_sucesso");

        alert(`Bem-vindo, ${authentication.nome}!`);

        window.location.href = authentication.ehFranqueadora
          ? "/admin"
          : "/user";
      } else {
        alert("Usuário ou senha incorretos!");
      }
    } catch (error) {
      console.error("Erro ao validar login:", error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      reset();
    }
  };

  return (
    <>
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
          <div className={styles.passwordContainer}>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Sua senha"
              {...register("password")}
            />

            <button
              type="button"
              className={styles.showPassButton}
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "🙉" : "🙈"}
            </button>
          </div>
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={styles.changePass}
          >
            Esqueci minha senha
          </button>
        </div>

        <button type="submit" disabled={isSubmitting} className={styles.button}>
          {isSubmitting ? "Autenticando..." : "Entrar"}
        </button>
      </form>
      <ModalAlterarSenha
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
