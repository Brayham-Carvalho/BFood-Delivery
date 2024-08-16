import styles from "@/src/utils/style";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { FORGOT_PASSWORD } from "../graphql/actions/forgot-password.action";

const formSchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordSchema = z.infer<typeof formSchema>;

const ForgotPassword = ({
  setActiveState,
}: {
  setActiveState: (e: string) => void;
}) => {
  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      const response = await forgotPassword({
        variables: {
          email: data.email,
        },
      });
      toast.success(
        "Por favor, verifique seu e-mail para redefinir sua senha."
      );
      reset();
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h1 className={`${styles.title}`}>Esqueceu sua senha?</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className={`${styles.label}`}>Insira seu E-mail</label>
        <input
          {...register("email")}
          type="email"
          placeholder="loginemail@email.com"
          className={`${styles.input}`}
        />
        {errors.email && (
          <span className="text-red-500 mt-1">{`${errors.email.message}`}</span>
        )}
        <br />
        <br />
        <input
          type="submit"
          value="Enviar"
          disabled={isSubmitting || loading}
          className={`${styles.button} mt-3`}
        />

        <br />
        <h5 className="text-center pt-4 font-Poppins text-[14px] text-white">
          ou voltar para{" "}
          <span
            className="text-[#2198ff] pl-1 cursor-pointer"
            onClick={() => setActiveState("Login")}
          >
            Login
          </span>
        </h5>
        <br />
      </form>
    </div>
  );
};

export default ForgotPassword;
