import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from 'react';

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { signin, errors: loginErrors, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate()

  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  useEffect(()=>{
    if(isAuthenticated){
      navigate('/cargaDocs')
    }

  }, [isAuthenticated])

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center px-4">
      <div className="bg-zinc-300 max-w-md w-full p-10 rounded-md shadow-lg">
        {loginErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white text-center my-2" key={i}>
            {error}
          </div>
        ))}
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
            placeholder="Correo electrónico"
          />
          {errors.email && (
            <p className="text-red-500">El correo electrónico es requerido</p>
          )}
          <input
            type="password"
            {...register("contrasena", { required: true })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
            placeholder="Contraseña"
          />
          {errors.contrasena && (
            <p className="text-red-500">La contraseña es requerida</p>
          )}
          <button
            type="submit"
            className="w-full bg-zinc-700 text-white py-2 rounded-md hover:bg-zinc-800 transition-colors"
          >
            Entrar
          </button>
        </form>
        <p className="mt-4 text-center">
          ¿No tienes una cuenta aún? Contacta con un Adminstrador
        </p>
      </div>
    </div>
  );
}

export default LoginPage