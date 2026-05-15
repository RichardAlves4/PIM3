import React, { useState } from "react";

// Importação do hook para gerenciamento de formulários
import { useForm } from "react-hook-form";

// Instância do axios para realizar chamadas à API
import api from "../../../services/api";

// Importação dos estilos específicos do modal
import styles from "./modalAlterarSenha.module.css";

export function ModalAlterarSenha({ isOpen, onClose }) {

  // Estado local para alternar a visibilidade do texto da senha
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Inicialização do React Hook Form para lidar com inputs, submissão e erros
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isSubmitting } 
  } = useForm();      

  /*Lógica de processamento da troca de senha*/
  const handleTrocarSenha = async (data) => {
    try {
      // 1. Busca todas as propriedades cadastradas no servidor
      const response = await api.get("/Propriedades");
      
      // 2. Tenta encontrar um registro que coincida com o usuário e o CNPJ
      const propriedades = response.data.find(
        (u) =>
          u.nome.toLowerCase() === data.usuario.toLowerCase() &&
          u.cnpj === data.cnpj
      );

      // 3. Validação: Se não encontrar o par Usuário/CNPJ, interrompe o processo
      if (!propriedades) {
        alert("Nome ou CNPJ incorretos");
        return;
      }

      // 4. Monta o objeto de atualização (Payload)
      // Mantém os dados antigos (...propriedades) e substitui apenas a senha pela 'novaSenha'
      const payload = {
        ...propriedades,
        senha: data.novaSenha,
      };

      // 5. Envia uma requisição PUT para o ID específico do objeto encontrado
      await api.put(`/Propriedades/${propriedades.id}`, payload);

      // 6. Feedback positivo, limpa o formulário e fecha o modal
      alert("Senha alterada com sucesso!");
      reset();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  // Renderização Condicional: Se o modal não estiver aberto, não renderiza nada no DOM
  if (!isOpen) return null;

  return (
    <div className={styles.container}>
      <div className={styles.modalContent}>
        <h2>Mudar Senha</h2>
        <p>Valide os dados da sua franquia</p>

        {/* handleSubmit valida os campos antes de chamar a função handleTrocarSenha */}
        <form onSubmit={handleSubmit(handleTrocarSenha)} className={styles.form}>
          
          {/* Campo Usuário */}
          <div className={styles.fieldContent}>
            <label>Usuário:</label>
            <input
              {...register("usuario", { required: "*Nome obrigatório" })}
              // Aplica classe de erro dinamicamente se houver falha na validação
              className={errors.usuario ? styles.errorInput : styles.formInput}
              placeholder="Nome da unidade"
            />
            {/* Exibe mensagem de erro abaixo do campo, se existir */}
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
                // Alterna tipo entre 'text' e 'password' baseado no estado mostrarSenha
                type={mostrarSenha ? "text" : "password"}
                {...register("novaSenha", { 
                  required: "*Senha obrigatória",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" }
                })}
                placeholder="Digite a nova senha"
                className={errors.novaSenha ? styles.errorInput : styles.formInput}
              />
              {/* Botão de "Toggle" para visualizar a senha */}
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

          {/* Área de botões de ação */}
          <div className={styles.buttonsContainer}>
            {/* Botão de submissão: desabilitado enquanto a requisição está em curso (isSubmitting) */}
            <button 
              type="submit" 
              className={styles.buttonSubmit} 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Atualizar Senha"}
            </button>
            
            {/* Botão Cancelar: limpa os dados digitados e fecha o modal */}
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