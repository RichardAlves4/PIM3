import React, { useState } from "react";

// Hook para gerenciar o formulário
import { useForm } from "react-hook-form";

// Integrador entre o React Hook Form e a biblioteca de validação Yup
import { yupResolver } from "@hookform/resolvers/yup";

// Biblioteca para definição de esquemas de validação e mensagens de erro
import * as yup from "yup";

// Instância do Axios para chamadas HTTP
import api from "../../services/api";

// Componente de modal para recuperação de senha
import { ModalAlterarSenha } from "../modals/modalAlterarSenha/ModalAlterarSenha.jsx";

import styles from "./formLogin.module.css";

// Definição das regras de validação: ambos os campos são strings obrigatórias
const schema = yup.object({
  userAccess: yup.string().required("*Campo Obrigatório"),
  password: yup.string().required("*Campo Obrigatório"),
});

export function FormLogin() {

  // Estado para controlar a visibilidade do modal
  const [open, setOpen] = useState(false);

  // Estado para alternar entre mostrar/esconder o texto da senha
  const [showPass, setShowPass] = useState(false);

  // Desestruturação das funções do useForm
  const {
    handleSubmit, // Função que envolve a submissão e valida os dados antes de executar a lógica
    reset,        // Limpa os campos do formulário
    register,     // Registra os inputs para que o React Hook Form os monitore
    formState: { errors, isSubmitting }, // Captura erros de validação e estado de envio
  } = useForm({
    defaultValues: { userAccess: "", password: "" },
    resolver: yupResolver(schema), // Aplica as regras do Yup definidas acima
  });

  // Função principal de autenticação
  const realizarLogin = async (data) => {
    try {
      // Faz uma requisição GET para buscar a lista de usuários/propriedades
      const response = await api.get("/Propriedades");
      const propriedades = response.data;

      // Procura no array retornado se existe alguém com o nome e senha digitados
      const authentication = propriedades.find(
        (pro) => pro.nome === data.userAccess && pro.senha === data.password,
      );

      if (authentication) {
        // Persiste os dados do usuário e permissões no navegador
        localStorage.setItem(
          "unidadeLogada",
          JSON.stringify(authentication),
        );
        // Define se o usuário é administrador baseado na flag 'ehFranqueadora'
        localStorage.setItem(
          "isAdmin",
          authentication.ehFranqueadora ? "true" : "false",
        );
        // Cria um token fictício para controle de rota
        localStorage.setItem("token_simulado", "logado_com_sucesso");

        alert(`Bem-vindo, ${authentication.nome}!`);

        // Redirecionamento forçado baseado no nível de acesso
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
      // Limpa os campos de input independente de sucesso ou erro
      reset();
    }
  };

  return (
    <>
      {/* O onSubmit utiliza o handleSubmit do hook para processar a validação antes da função realizarLogin */}
      <form onSubmit={handleSubmit(realizarLogin)} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="userAccess">Usuário:</label>
          <input
            type="text"
            placeholder="Digite o nome da unidade"
            {...register("userAccess")} // Conecta o input ao useForm
          />
          {/* Exibição condicional da mensagem de erro de validação */}
          {errors.userAccess && (
            <span className={styles.error}>{errors.userAccess.message}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Senha:</label>
          <div className={styles.passwordContainer}>
            <input
              // Alterna dinamicamente entre 'password' (oculto) e 'text' (visível)
              type={showPass ? "text" : "password"}
              placeholder="Sua senha"
              {...register("password")}
            />

            {/* Botão para alternar a visibilidade da senha */}
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
          
          {/* Botão que abre o modal de recuperação de senha */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={styles.changePass}
          >
            Esqueci minha senha
          </button>
        </div>

        {/* O botão é desativado durante a requisição para evitar múltiplos cliques */}
        <button type="submit" disabled={isSubmitting} className={styles.button}>
          {isSubmitting ? "Autenticando..." : "Entrar"}
        </button>
      </form>

      {/* Componente de modal que recebe o estado de abertura e a função de fechar */}
      <ModalAlterarSenha
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}