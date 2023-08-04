import { Router } from 'express'
import { body } from 'express-validator'

import { UserConstroller } from '../controllers/user.controller'
import { authMiddleWare } from '../middlewares/auth.middleware'
import { roleMiddleWare } from '../middlewares/role.middleware'

const router = Router()

router.get(
	'/users',
	authMiddleWare,
	roleMiddleWare(['EMPLOYEE', 'HR']),
	UserConstroller.getUsers
)
router.get(
	'/statistics',
	authMiddleWare,
	roleMiddleWare(['HR']),
	UserConstroller.getUsersStatistics
)
router.get(
	'/refersh',
	authMiddleWare,
	roleMiddleWare(['EMPLOYEE', 'HR']),
	UserConstroller.refresh
)

router.post(
	'/add',
	authMiddleWare,
	roleMiddleWare(['HR']),
	UserConstroller.addUser
)
router.post(
	'/delete',
	authMiddleWare,
	roleMiddleWare(['HR']),
	UserConstroller.deleteUser
)
router.post(
	'/edit',
	authMiddleWare,
	roleMiddleWare(['HR']),
	UserConstroller.editUser
)
router.post(
	'/login',
	body('user_id').isInt(),
	body('password').isLength({ min: 8, max: 32 }),
	UserConstroller.login
)
router.post(
	'/logout',
	authMiddleWare,
	roleMiddleWare(['EMPLOYEE', 'HR']),
	UserConstroller.logout
)
router.post(
	'/password',
	body('password').isLength({ min: 8, max: 32 }),
	UserConstroller.setPassword
)

export const authRouter = router
