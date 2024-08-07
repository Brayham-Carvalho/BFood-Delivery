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

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type LoginSchema = z.infer<typeof formSchema>;

const Login = ({ setActiveState }: { setActiveState: (e: string) => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    console.log(data);
    reset();
  };

  const [show, setShow] = useState(false);
  return (
    <div>
      <h1 className={`${styles.title}`}>Login com BFood Delivery</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
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
          <span
            className={`${styles.label} text-[#2198ff] block text-right cursor-pointer`}
          >
            Esqueceu sua senha?
          </span>
          <input
            type="submit"
            value="Login"
            disabled={isSubmitting}
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
          Não tem uma conta?{" "}
          <span
            className="text-[#2198ff] pl-1 cursor-pointer"
            onClick={() => setActiveState("Signup")}
          >
            Crie uma conta
          </span>
        </h5>
        <br />
      </form>
    </div>
  );
};

export default Login;
