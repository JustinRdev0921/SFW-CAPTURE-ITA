// src/api/procesing.js
import axios from './axios'

export const getAreasRequest = () => axios.get(`/areas`)
export const getGruposRequest = () => axios.get(`/grupos`)
export const getTiposDocRequest = () => axios.get(`/tiposdoc`)

// Flujo original
export const createProcesingRequest = (procesing) =>
  axios.post(`/procesing`, procesing)

// Nuevo: flujo sin atributos
export const createProcesingNoAttsRequest = (procesing) =>
  axios.post(`/procesing/no-attributes`, procesing)
