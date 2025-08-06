import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

export default function MetadataForm({ sitios, ciudades, areas, grupos, tipos }) {
  const { register, watch, setValue, formState: { errors } } = useFormContext()
  const selectedArea = watch('area')
  const selectedGrupo = watch('grupo')

  useEffect(() => {
    if (selectedArea) {
      setValue('grupo', '')
      setValue('tipoDocumento', '')
    }
  }, [selectedArea, setValue])

  useEffect(() => {
    if (selectedGrupo) {
      setValue('tipoDocumento', '')
    }
  }, [selectedGrupo, setValue])

  const filteredGrupos = grupos.filter(g => g.idArea === String(selectedArea))
  const filteredTipos = tipos.filter(t => t.idGrupo === String(selectedGrupo))

  return (
    <>
      {/* Sitio */}
      <div className="mb-4">
        <label className="block mb-2">Sitio</label>
        <select
          {...register('sitio', { required: true })}
          className="w-full bg-gray-200 rounded-md px-4 py-2"
        >
          <option value="">Selecciona el Sitio SharePoint</option>
          {sitios.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
        </select>
        {errors.sitio && <p className="text-red-500">Requerido</p>}
      </div>

      {/* Ciudad */}
      <div className="mb-4">
        <label className="block mb-2">Ciudad</label>
        <select
          {...register('ciudad', { required: true })}
          className="w-full bg-gray-200 rounded-md px-4 py-2"
        >
          <option value="">Selecciona la Ciudad</option>
          {ciudades.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        {errors.ciudad && <p className="text-red-500">Requerido</p>}
      </div>

      {/* Área */}
      <div className="mb-4">
        <label className="block mb-2">Área</label>
        <select
          {...register('area', { required: true })}
          className="w-full bg-gray-200 rounded-md px-4 py-2"
        >
          <option value="">Selecciona el área</option>
          {areas.map(a => <option key={a.id} value={a.id}>{a.nombreArea}</option>)}
        </select>
        {errors.area && <p className="text-red-500">Requerido</p>}
      </div>

      {/* Grupo */}
      <div className="mb-4">
        <label className="block mb-2">Grupo</label>
        <select
          {...register('grupo', { required: true })}
          className="w-full bg-gray-200 rounded-md px-4 py-2"
        >
          <option value="">Selecciona el grupo</option>
          {filteredGrupos.map(g => <option key={g.id} value={g.id}>{g.nombreGrupo}</option>)}
        </select>
        {errors.grupo && <p className="text-red-500">Requerido</p>}
      </div>

      {/* Tipo de Documento */}
      <div className="mb-4">
        <label className="block mb-2">Tipo de Documento</label>
        <select
          {...register('tipoDocumento', { required: true })}
          className="w-full bg-gray-200 rounded-md px-4 py-2"
        >
          <option value="">Selecciona el tipo de documento</option>
          {filteredTipos.map(t => <option key={t.id} value={t.id}>{t.nombreTipoDoc}</option>)}
        </select>
        {errors.tipoDocumento && <p className="text-red-500">Requerido</p>}
      </div>

      {/* Fecha */}
      <div className="mb-4">
        <label className="block mb-2">Fecha</label>
        <input
          type="date"
          {...register('fecha', { required: true })}
          className="w-full bg-gray-200 rounded-md px-4 py-2"
        />
        {errors.fecha && <p className="text-red-500">Requerido</p>}
      </div>
    </>
  )
}