import { Router } from 'express'
import { isLogged } from '../middleware/islogged.js'
import { isGuest } from '../middleware/isGuest.js'
import { register, login, changeData } from '../controllers/User.controller.js'

const router = Router()

router.post('/auth/register', isGuest, register)
router.post('/auth/login', isGuest, login)
router.put('/changeData', isLogged, changeData)


export default router
