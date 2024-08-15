"use client";

import styles from "@/src/utils/style";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "@/src/graphql/actions/login.action";
import path from "path";
import { RESET_PASSWORD } from "@/src/graphql/actions/reset-password.action";

const formSchema = z
  .object({
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres"),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    { message: "As senhas precisam ser iguais", path: ["confirmPassword"] }
  );

type ResetPasswordSchema = z.infer<typeof formSchema>;

const ResetPasword = ({
  activationToken,
}: {
  activationToken: string | string[];
}) => {
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(formSchema),
  });

  const [show, setShow] = useState(false);
  const [confirmPasswordShow, setconfirmPasswordShow] = useState(false);
  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
      const response = await resetPassword({
        variables: {
          password: data.password,
          activationToken: activationToken,
        },
      });
      toast.success("Senha redefinida com sucesso!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full flex justify-center items-center h-screen">
      <h1 className={`${styles.title}`}>Login com BFood Delivery</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full mt-5 relative mb-1">
          <label htmlFor="password" className={`${styles.label}`}>
            Insira sua senha
          </label>
          <input
            {...register("password")}
            type={!show ? "password" : "text"}
            placeholder="********"
            className={`${styles.input}`}
          />

          {show ? (
            <AiOutlineEyeInvisible
              className="absolute botton-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(false)}
            />
          )}
        </div>
        {errors.password && (
          <span className="text-red-500">{`${errors.password.message}`}</span>
        )}

        <div className="w-full mt-5 relative mb-1">
          <label htmlFor="password" className={`${styles.label}`}>
            Confirme sua senha
          </label>
          <input
            {...register("confirmPassword")}
            type={!confirmPasswordShow ? "password" : "text"}
            placeholder="********"
            className={`${styles.input}`}
          />

          {confirmPasswordShow ? (
            <AiOutlineEyeInvisible
              className="absolute botton-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setconfirmPasswordShow(false)}
            />
          )}
        </div>
        {errors.confirmPassword && (
          <span className="text-red-500">{`${errors.confirmPassword.message}`}</span>
        )}

        <input
          type="submit"
          value="Enviar"
          disabled={isSubmitting || loading}
          className={`${styles.button} mt-3`}
        />
      </form>
    </div>
  );
};

export default ResetPasword;
