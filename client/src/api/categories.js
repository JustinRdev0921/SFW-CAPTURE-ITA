// src/api/categories.js
import axios from './axios';

/** Devuelve solo el array items de la API */
export async function getCategoriesByOwner(owner = 0) {
  const { data } = await axios.get('/categories', { params: { owner } });
  return data.items ?? [];
}