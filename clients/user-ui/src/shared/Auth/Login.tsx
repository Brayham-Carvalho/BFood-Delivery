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
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "@/src/graphql/actions/login.action";
import Cookies from "js-cookie";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type LoginSchema = z.infer<typeof formSchema>;

const Login = ({
  setActiveState,
  setOpen,
}: {
  setActiveState: (e: string) => void;
  setOpen: (e: boolean) => void;
}) => {
  const [Login, { loading }] = useMutation(LOGIN_USER);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginSchema>({
    resolver: zodResolver(formSchema),
  });

  const [show, setShow] = useState(false);
  const onSubmit = async (data: LoginSchema) => {
    try {
      const loginData = {
        email: data.email,
        password: data.password,
      };
      const response = await Login({
        variables: loginData,
      });
      if (response.data.Login.user) {
        toast.success("Login realizado com sucesso!");
        Cookies.set("refresh_token", response.data.Login.refreshToken);
        Cookies.set("access_token", response.data.Login.accessToken);
        setOpen(false);
        reset();
        window.location.reload();
      } else {
        toast.error(response.data.Login.error.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

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
          <span className="text-red-500 mt-1">{`${errors.email.message}`}</span>
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
        <div className="w-full mt-5">
          <span
            className={`${styles.label} text-[#2198ff] block text-right cursor-pointer`}
            onClick={() => setActiveState("Forgot-Password")}
          >
            Esqueceu sua senha?
          </span>
          <input
            type="submit"
            value="Login"
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
