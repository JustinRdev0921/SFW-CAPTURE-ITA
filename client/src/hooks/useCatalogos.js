import { useState, useEffect } from 'react'
import { getAreasRequest, getGruposRequest, getTiposDocRequest } from '../api/procesing'
import { sitiosOptions, ciudadesOptions } from '../api/options'

export function useCatalogos(user, isAuthenticated) {
  const [areas, setAreas] = useState([])
  const [grupos, setGrupos] = useState([])
  const [tipos, setTipos] = useState([])

  useEffect(() => {
    if (!isAuthenticated) return
    (async () => {
      const [aRes, gRes, tRes] = await Promise.all([
        getAreasRequest(),
        getGruposRequest(),
        getTiposDocRequest(),
      ])
      const áreasFiltradas = user.Admin !== 1
        ? aRes.data.filter(a => user.idArea.includes(a.id))
        : aRes.data
      setAreas(áreasFiltradas)
      setGrupos(gRes.data)
      setTipos(tRes.data)
    })()
  }, [user, isAuthenticated])

  return { sitios: sitiosOptions, ciudades: ciudadesOptions, areas, grupos, tipos }
}