import { Router } from 'express'

import { userRouter } from './user.route'
import { authRouter } from './auth.route'

const router = Router()

router.use('/auth', authRouter)
router.use('/user', userRouter)

export const mainRouter = router
