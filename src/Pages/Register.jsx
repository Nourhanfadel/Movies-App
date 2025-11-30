import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Register() {
  const { signUp } = useAuth();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const { email, password } = data;
    const { error } = await signUp(email, password);

    if (error) alert(error.message);
    else alert("Account created! Check your email to confirm.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-zinc-900 p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <input
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white 
            placeholder-gray-400 focus:outline-none focus:ring-2 
            focus:ring-red-500"
            {...register("email", { required: true })}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white 
            placeholder-gray-400 focus:outline-none focus:ring-2 
            focus:ring-pink-900"
            {...register("password", { required: true })}
          />

          <button
            type="submit"
            className="w-full bg-pink-900 hover:bg-pink-800 text-white 
            py-3 rounded-lg font-semibold transition duration-200"
          >
            Register
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-900 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
