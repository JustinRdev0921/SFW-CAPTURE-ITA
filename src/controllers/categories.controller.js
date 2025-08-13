// src/controllers/categories.controller.js
import { searchCategoryByOwner } from '../libs/softexpert.js'

export async function listCategories(req, res, next) {
  try {
    const { owner } = req.query // ej: ?owner=0
    const items = await searchCategoryByOwner(owner)
    res.json({ total: items.length, items })
  } catch (e) {
    next(e)
  }
}