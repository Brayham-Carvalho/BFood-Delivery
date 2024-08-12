import styles from "@/src/utils/style";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordSchema = z.infer<typeof formSchema>;

const ForgotPassword = ({
  setActiveState,
}: {
  setActiveState: (e: string) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(formSchema),
  });

  const [show, setShow] = useState(false);
  const onSubmit = async (data: ForgotPasswordSchema) => {
    console.log(data);
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
          disabled={isSubmitting}
          className={`${styles.button} mt-3`}
        />

        <br />
        <h5 className="text-center pt-4 font-Poppins text-[14px]">
          ou Voltar para
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
