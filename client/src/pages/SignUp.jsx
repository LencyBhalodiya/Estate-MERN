import { Link, useNavigate } from "react-router-dom";
import { ACTION_IDS } from "@components/actions/action.constants";
import api from "@components/util/fetchers.js"
import { OAuth } from '@components'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from 'react-toastify';


const schema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})

export default function SignUp() {
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (formData) => {
    try {
      const { data, statusCode } = await api.post(ACTION_IDS.SIGNUP_API, formData)
      if (statusCode >= 400) {
        setError("root", { message:'Email already registered' })
        return;
      }
      toast.success("User created Successfully, Please Login In !", {
        position: "bottom-right"
      });
      navigate("/sign-in"); 
    } catch (error) {
      setError("root", { message: 'Some Error Occurred' })
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7"> Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          {...register("username")}
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
        />
        {errors.username && (<div className="text-red-500">{errors.username.message}</div>)}

        <input
          {...register("email")}
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
        />
        {errors.email && (<div className="text-red-500">{errors.email.message}</div>)}
        <input
          {...register("password")}
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
        />
        {errors.password && (<div className="text-red-500">{errors.password.message}</div>)}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disable:opacity-80"
        >
          {isSubmitting ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      {errors.root && (<div className="text-red-500">{errors.root.message}</div>)}

      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
    </div>
  );
}
