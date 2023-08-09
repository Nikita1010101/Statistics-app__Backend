import { Router } from 'express'

import { authMiddleWare } from '../middlewares/auth.middleware'
import { roleMiddleWare } from '../middlewares/role.middleware'
import { UserConstroller } from '../controllers/user.controller'

const router = Router()

router.get(
	'/users',
	authMiddleWare,
	// roleMiddleWare(['EMPLOYEE', 'HR']),
	UserConstroller.getUsers
)
router.get(
	'/statistics',
	authMiddleWare,
	roleMiddleWare(['HR']),
	UserConstroller.getUsersStatistics
)

router.post(
	'/add',
	authMiddleWare,
	roleMiddleWare(['HR']),
	UserConstroller.addUser
)

router.patch(
	'/edit',
	authMiddleWare,
	roleMiddleWare(['HR']),
	UserConstroller.editUser
)

router.delete(
	'/delete',
	authMiddleWare,
	roleMiddleWare(['HR']),
	UserConstroller.deleteUser
)
export const userRouter = router
