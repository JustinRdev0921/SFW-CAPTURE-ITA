import { useForm } from "react-hook-form";
import { useUsers } from "../context/UsersContext";
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ciudadesOptions, areasOptionsS, adminOptions, listNames, activoOptions, departamentoOptionsS } from "../api/options";
import { getAreasRequest } from "../api/procesing";

function UserFormPage() {
  const { user, isAuthenticated } = useAuth();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const { createUsuario, getUser, updateUser } = useUsers();
  const navigate = useNavigate();
  const params = useParams();

  const [areasOptions, setAreasOptions] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const areasResponse = await getAreasRequest();
        setAreasOptions(areasResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    async function loadUser() {
      if (params.id) {
        const user = await getUser(params.id);
        console.log(user);
        setValue('username', user.username);
        setValue('email', user.email);
        setValue('nombreUsuario', user.nombreUsuario);
        setValue('contrasena', ''); // No mostramos la contraseña original
        setValue('idDepartamento', user.idDepartamento);
        setValue('idCiudad', parseInt(user.idCiudad));
        setValue('Activo', parseInt(user.Activo));
        setValue('Admin', parseInt(user.Admin));
        setSelectedAreas(user.areas ? user.areas.map(area => area.id) : []);
      }
    }
    loadUser();
  }, [params.id, getUser, setValue]);

  const handleCheckboxChange = (areaId) => {
    setSelectedAreas(prevSelected => {
      if (prevSelected.includes(areaId)) {
        return prevSelected.filter(id => id !== areaId);
      } else {
        return [...prevSelected, areaId];
      }
    });
  };

  const onSubmit = handleSubmit((data) => {
    data.areas = selectedAreas;
    // Si el campo de contraseña está vacío, no actualizamos la contraseña
    if (!data.contrasena) {
      delete data.contrasena;
    }

    if (params.id) {
      console.log('data para actualizar:', data);
      updateUser(params.id, data);
    } else {
      createUsuario(data);
      console.log('data para crear:', data);
    }
    navigate('/cargaDocs');
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="bg-zinc-300 max-w-3xl w-full p-5 rounded-md shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Crear/Editar Usuario</h1>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <label htmlFor="username" className="block">Nombre de usuario</label>
            <input
              type="text"
              placeholder="Nombre de usuario"
              {...register('username', { required: true })}
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
              autoFocus
            />
            {errors.username && (<p className="text-red-500">El nombre de usuario es requerido</p>)}
          </div>
          <div className="col-span-1">
            <label htmlFor="email" className="block">Correo electrónico</label>
            <input
              type="email"
              placeholder="Correo electrónico"
              {...register('email', { required: true })}
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            />
            {errors.email && (<p className="text-red-500">El correo electrónico es requerido</p>)}
          </div>
          <div className="col-span-1">
            <label htmlFor="nombreUsuario" className="block">Nombre Completo</label>
            <input
              type="text"
              placeholder="Nombre Completo"
              {...register('nombreUsuario', { required: true })}
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            />
            {errors.nombreUsuario && (<p className="text-red-500">El nombre completo es requerido</p>)}
          </div>
          <div className="col-span-1">
            <label htmlFor="contrasena" className="block">Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              {...register('contrasena', params.id ? { required: false } : { required: true } )}
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            />
            {errors.contrasena && (<p className="text-red-500">La contraseña es requerida</p>)}
          </div>
          <div className="col-span-1">
            <label htmlFor="idDepartamento" className="block">Departamento</label>
            <select
              {...register('idDepartamento', { required: true })}
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            >
              <option value="">Selecciona un departamento</option>
              {departamentoOptionsS.map(departamento => (
                <option key={departamento.id} value={departamento.id}>
                  {departamento.nombre}
                </option>
              ))}
            </select>
            {errors.idDepartamento && (<p className="text-red-500">El departamento es requerido</p>)}
          </div>
          <div className="col-span-1">
            <label htmlFor="idCiudad" className="block">Ciudad</label>
            <select
              {...register('idCiudad', { required: true })}
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            >
              <option value="">Selecciona una ciudad</option>
              {ciudadesOptions.map(ciudad => (
                <option key={ciudad.id} value={ciudad.id}>
                  {ciudad.nombre}
                </option>
              ))}
            </select>
            {errors.idCiudad && (<p className="text-red-500">La ciudad es requerida</p>)}
          </div>
          <div className="col-span-1">
            <label htmlFor="Activo" className="block">Estado Activo</label>
            <select {...register('Activo', { required: true })} defaultValue="1" className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2">
              <option value="">Selecciona Estado</option>
              {activoOptions.map(opcion => (
                <option key={opcion.id} value={opcion.id}>{opcion.nombre}</option>
              ))}
            </select>
            {errors.Activo && (<p className="text-red-500">Indicar si el usuario está activo o no es requerido</p>)}
          </div>
          <div className="col-span-1">
            <label htmlFor="Admin" className="block">¿Es administrador?</label>
            <select {...register('Admin', { required: true })} className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2">
              <option value="">Selecciona {listNames.admin}</option>
              {adminOptions.map(admin => (
                <option key={admin.id} value={admin.id}>{admin.nombre}</option>
              ))}
            </select>
            {errors.Admin && (<p className="text-red-500">Indicar si es admin o no es requerido</p>)}
          </div>
          <div className="col-span-2">
            <label htmlFor="areas" className="block">Áreas</label>
            <div className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2">
              {areasOptions.map(area => (
                <div key={area.id} className="flex items-center">
                  <input
                  {...register('areas', { required: true })} 
                    type="checkbox"
                    id={`area-${area.id}`}
                    checked={selectedAreas.includes(area.id)}
                    onChange={() => handleCheckboxChange(area.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`area-${area.id}`}>{area.nombreArea}</label>
                </div>
              ))}
            </div>
            {errors.areas && (<p className="text-red-500">Selecciona al menos un área</p>)}
          </div>
          <div className="col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Guardar Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserFormPage;
