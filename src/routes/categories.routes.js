// src/routes/categories.routes.js
import { Router } from 'express'
import { listCategories } from '../controllers/categories.controller.js'

const router = Router()
router.get('/categories', listCategories) // GET /api/categories?owner=0
export default router