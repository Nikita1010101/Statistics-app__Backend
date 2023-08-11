import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { body } from 'express-validator'

const router = Router()

router.get('/refresh', AuthController.refresh)

router.post(
	'/password',
	body('password').isLength({ min: 8, max: 32 }),
	AuthController.setPassword
)
router.post(
	'/login',
	body('user_id').isInt(),
	body('password').isLength({ min: 8, max: 32 }),
	AuthController.login
)
router.delete(
	'/logout',
	AuthController.logout
)

export const authRouter = router
