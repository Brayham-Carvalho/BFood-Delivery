import styles from "@/src/utils/style";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import {
  AiFillGithub,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "@/src/graphql/actions/register.action";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: z.string().email(),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  phone_number: z
    .number()
    .min(11, "O número de telefone deve ter no mínimo 11 caracteres"),
});

type SignUpSchema = z.infer<typeof formSchema>;

const Signup = ({
  setActiveState,
}: {
  setActiveState: (e: string) => void;
}) => {
  const [registerUserMutation, { loading, error, data }] =
    useMutation(REGISTER_USER);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpSchema>({
    resolver: zodResolver(formSchema),
  });

  const [show, setShow] = useState(false);
  const onSubmit = async (data: SignUpSchema) => {
    try {
      const response = await registerUserMutation({
        variables: data,
      });
      localStorage.setItem("activation_token", response.data.activation_token);

      toast.success("Verifique seu e-mail para ativação de sua conta");
      reset();
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div>
      <h1 className={`${styles.title}`}>Registre-se com BFood Delivery</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full relative mb-3">
          <label className={`${styles.label}`}>Insira seu Nome</label>
          <input
            {...register("name")}
            type="text"
            placeholder="Insira seu nome"
            className={`${styles.input}`}
          />
        </div>

        <label className={`${styles.label}`}>Insira seu E-mail</label>
        <input
          {...register("email")}
          type="email"
          placeholder="loginemail@email.com"
          className={`${styles.input}`}
        />
        {errors.email && (
          <span className="text-red-500 block mt-1">{`${errors.email.message}`}</span>
        )}
        <div className="w-full relative mt-3">
          <label className={`${styles.label}`}>
            Insira seu número de Telefone
          </label>
          <input
            {...register("phone_number", { valueAsNumber: true })}
            type="number"
            className={`${styles.input}`}
          />
        </div>
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
          {errors.password && (
            <span className="text-red-500 block mt-1">{`${errors.password.message}`}</span>
          )}
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
        <div className="w-full mt-5">
          <input
            type="submit"
            value="Signup"
            disabled={isSubmitting || loading}
            className={`${styles.button} mt-3`}
          />
        </div>
        <br />
        <h5 className="text-center pt-4 font-Poppins text-[16px] text-white">
          Ou com
        </h5>
        <div className="flex justify-center items-center my-3">
          <FcGoogle size={30} className=" cursor-pointer mr-2" />
          <AiFillGithub size={30} className=" cursor-pointer ml-2" />
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[14px]">
          Já tem uma conta?{" "}
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

export default Signup;
