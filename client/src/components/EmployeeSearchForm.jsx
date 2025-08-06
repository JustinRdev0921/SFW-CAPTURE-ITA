import React from 'react'
import { useForm } from 'react-hook-form'
import { getEmpleadoRequest } from '../api/empleado'

export default function EmployeeSearchForm({ onLoad }) {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async ({ nroExpediente }) => {
    try {
      const res = await getEmpleadoRequest(nroExpediente)
      const empleado = res.data.EMPLEADOS[0]
      onLoad(nroExpediente, empleado)
    } catch (error) {
      console.error(error)
      onLoad(null, null)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label className="block mb-2">Nro expediente</label>
      <input
        type="number"
        {...register('nroExpediente', { required: true })}
        className="w-full bg-gray-200 rounded-md px-4 py-2"
      />
      {errors.nroExpediente && <p className="text-red-500">Requerido</p>}
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full mt-2">
        Buscar
      </button>
    </form>
  )
}