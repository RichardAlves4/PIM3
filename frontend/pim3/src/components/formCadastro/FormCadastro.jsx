import React from 'react'
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import styles from './formCadastro.module.css'

const schama = yup.object({
  name: yup
  .string()
  .required("*Campo Obrigatório")
  .typeError("Usuário Inválido"),
  lastName: yup
  .string()
  .required("*Campo Obrigatório")
  .typeError("Senha Inválido"),
  lastName: yup
  .string()
  .required("*Campo Obrigatório")
  .typeError("Senha Inválido"),
  lastName: yup
  .string()
  .required("*Campo Obrigatório")
  .typeError("Senha Inválido"),
  lastName: yup
  .string()
  .required("*Campo Obrigatório")
  .typeError("Senha Inválido"),

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
      userAccess: "",
      password: "",
    },
    resolver: yupResolver(schama),
  });

  const onSubmit = (data) => {
    console.log(data);

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
          {isSubmitting ? "Enviando..." : "Cadastrar"}
        </button>
      </form>
  )
}