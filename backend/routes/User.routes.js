import { Router } from 'express'
import { isGuest } from '../middleware/isGuest.js'
import { register, login } from '../controllers/User.controller.js'

const router = Router()

router.post('/auth/register', isGuest, register)
router.post('/auth/login', isGuest, login)

export default router
