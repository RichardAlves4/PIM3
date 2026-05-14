import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../services/api";
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
      const response = await api.get("/Propriedades");
      const propriedades = response.data.find(
        (u) =>
          u.nome.toLowerCase() === data.usuario.toLowerCase() &&
          u.cnpj === data.cnpj
      );

      if (!propriedades) {
        alert("Nome ou CNPJ incorretos");
        return;
      }

      const payload = {
        ...propriedades,
        senha: data.novaSenha,
      };

      await api.put(`/Propriedades/${propriedades.id}`, payload);

      alert("Senha alterada com sucesso!");
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
        <h2>Mudar Senha</h2>
        <p>Valide os dados da sua franquia</p>

        <form onSubmit={handleSubmit(handleTrocarSenha)} className={styles.form}>
          
          {/* Campo Usuário */}
          <div className={styles.fieldContent}>
            <label>Usuário:</label>
            <input
              {...register("usuario", { required: "*Nome obrigatório" })}
              className={errors.usuario ? styles.errorInput : styles.formInput}
              placeholder="Nome da unidade"
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
            <div className={styles.passwordContainer}>
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
                className={styles.showPassButton}
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                {mostrarSenha ? "🙉" : "🙈"}
              </button>
            </div>
            {errors.novaSenha && <span className={styles.errorMessage}>{errors.novaSenha.message}</span>}
          </div>

          <div className={styles.buttonsContainer}>
            <button 
              type="submit" 
              className={styles.buttonSubmit} 
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
              className={styles.buttonCancel}
            >
              Sair
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
