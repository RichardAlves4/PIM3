import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../services/api';
import styles from './modalProduto.module.css';

// 1. Definição do Schema de Validação
const schema = yup.object({
  nome: yup.string().required("O nome é obrigatório"),
  quantidadeAtual: yup.number().transform((value) => (isNaN(value) ? 0 : value)).min(0, "Mínimo 0"),
  minimoSugerido: yup.number().transform((value) => (isNaN(value) ? 0 : value)).min(0, "Mínimo 0"),
  unidade: yup.string().required("Selecione a unidade"),
  categoria: yup.string().required("Selecione a categoria"),
  dataFabricacao: yup.date().nullable().typeError("Data inválida"),
  validade: yup.date().nullable().typeError("Data inválida")
}).required();

export function ModalProduto({ isOpen, onClose, onSubmit, produto }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: produto || { unidade: 'Kg', categoria: 'carnes' }
  });

  // Limpa o formulário quando o modal abre/fecha ou o produto muda
  React.useEffect(() => {
    if (produto) {
      // Se estamos editando, mapeamos os dados que vêm do banco (C#)
      // para os nomes que o formulário entende (register)
      reset({
        nome: produto.produto?.nome, // Pega o nome de dentro do objeto aninhado
        quantidadeAtual: produto.quantidadeAtual,
        minimoSugerido: produto.minimoSugerido,
        unidade: produto.unidade,
        categoria: produto.produto?.categoria || "carnes",
        dataFabricacao: produto.dataFabricacao ? produto.dataFabricacao.split('T')[0] : "",
        validade: produto.validade ? produto.validade.split('T')[0] : ""
      });
    } else {
      // Se for um novo produto, limpa para os valores padrão
      reset({
        nome: "",
        quantidadeAtual: 0,
        unidade: 'Kg',
        categoria: 'carnes',
        dataFabricacao: "",
        validade: ""
      });
    }
  }, [produto, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{produto ? 'Editar Produto' : 'Novo Produto'}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.formGrid}>
          <div className={styles.fullWidth}>
            <label>Nome do Produto:</label>
            <input {...register("nome")} className={errors.nome ? styles.errorInput : ""} />
            <span className={styles.errorMessage}>{errors.nome?.message}</span>
          </div>

          <div className={styles.row}>
            <div>
              <label>Qtd. Atual:</label>
              <input type="number" {...register("quantidadeAtual")} />
            </div>
            <div>
              <label>Unidade:</label>
              <select {...register("unidade")}>
                <option value="Kg">Kg</option>
                <option value="Unid">Unid</option>
                <option value="L">L</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div>
              <label>Mínimo Sugerido:</label>
              <input type="number" {...register("minimoSugerido")} />
            </div>
            <div>
              <label>Categoria:</label>
              <select {...register("categoria")}>
                <option value="carnes">Carnes</option>
                <option value="bebidas">Bebidas</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div>
              <label>Fabricação:</label>
              <input type="date" {...register("dataFabricacao")} />
            </div>
            <div>
              <label>Validade:</label>
              <input type="date" {...register("validade")} />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.btnCancel}>Cancelar</button>
            <button type="submit" className={styles.btnSubmit}>
              {produto ? 'Salvar Alterações' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}