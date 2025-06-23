import { Router } from 'express'

import { createCategory, getCategories } from '../controllers/Categories.controller.js'

const router = Router()

router.post('/createCategory', createCategory)
router.get('/categories', getCategories)

export default router