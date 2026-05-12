import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import styles from "./modalAlterarSenha.module.css";

export function ModalAlterarSenha({ isOpen, onClose }) {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isSubmitting } 
  } = useForm();      

  const handleTrocarSenha = async (data) => {
    try {
      const res = await api.get("/Propriedades");
      const unidade = res.data.find(
        (u) =>
          u.nome.toLowerCase() === data.usuario.toLowerCase() &&
          u.cnpj === data.cnpj
      );

      if (!unidade) {
        alert("Dados de validação incorretos! Verifique o Nome e o CNPJ.");
        return;
      }

      const payload = {
        ...unidade,
        senha: data.novaSenha, // Usando o nome correto do campo
      };

      await api.put(`/Propriedades/${unidade.id}`, payload);

      alert("Senha alterada com sucesso! Agora você já pode logar.");
      reset();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.container}>
      <div className={styles.modalContent}>
        <h2>Alterar Senha</h2>
        <p>Valide os dados da sua franquia</p>

        <form onSubmit={handleSubmit(handleTrocarSenha)} className={styles.form}>
          
          {/* Campo Usuário */}
          <div className={styles.fieldContent}>
            <label>Usuário:</label>
            <input
              {...register("usuario", { required: "*Nome obrigatório" })}
              className={errors.usuario ? styles.errorInput : styles.formInput}
              placeholder="Nome do Usuário/Unidade"
            />
            {errors.usuario && <span className={styles.errorMessage}>{errors.usuario.message}</span>}
          </div>

          {/* Campo CNPJ */}
          <div className={styles.fieldContent}>
            <label>CNPJ:</label>
            <input
              {...register("cnpj", { required: "*CNPJ obrigatório" })}
              className={errors.cnpj ? styles.errorInput : styles.formInput}
              placeholder="CNPJ (apenas números)"
            />
            {errors.cnpj && <span className={styles.errorMessage}>{errors.cnpj.message}</span>}
          </div>

          {/* Campo Nova Senha */}
          <div className={styles.fieldContent}>
            <label>Nova Senha:</label>
            <div className={styles.passwordWrapper}>
              <input
                type={mostrarSenha ? "text" : "password"}
                {...register("novaSenha", { 
                  required: "*Senha obrigatória",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" }
                })}
                placeholder="Digite a nova senha"
                className={errors.novaSenha ? styles.errorInput : styles.formInput}
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                {mostrarSenha ? "🙉" : "🙈"}
              </button>
            </div>
            {errors.novaSenha && <span className={styles.errorMessage}>{errors.novaSenha.message}</span>}
          </div>

          <div className={styles.actions}>
            <button 
              type="submit" 
              className={styles.btnSubmit} 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Atualizar Senha"}
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className={styles.btnCancel}
            >
              Sair
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
