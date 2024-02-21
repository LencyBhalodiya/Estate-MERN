import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "@components/util/fetchers.js"
import { signInSuccess, } from "../redux/user/userSlice";
import { OAuth } from '@components'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { ACTION_IDS } from "@components/actions/action.constants";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})
export default function SignIn() {
  const { error } = useSelector((state) => state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (formData) => {
    try {
      const { data, statusCode } = await api.post(ACTION_IDS.LOGIN_API, formData)
      console.log(data);
      if (statusCode !== 200) {
        setError("root", { message: data || 'Invalid Credentials' })
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");

    } catch (error) {
      setError("root", { message: 'Some Error Occurred' })
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7"> Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          {...register("email")}
          type="name"
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
          {isSubmitting ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
        {errors.root && (<div className="text-red-500">{errors.root.message}</div>)}
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont Have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
