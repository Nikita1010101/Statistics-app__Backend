import { NextFunction, Request, RequestHandler, Response } from 'express'
import { validationResult } from 'express-validator'

import { ApiError } from '../exceptions/api.error'
import { UserService } from '../services/user.service'
import { IAddUser, IEditUser } from '../types/user.type'

class UserControllerClass {
	getUsers: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const users = await UserService.getUsers()
			res.send(users)
		} catch (error) {
			next(error)
		}
	}

	getStatistics: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const statistics = await UserService.getStatistics()

			res.send(statistics)
		} catch (error) {
			next(error)
		}
	}

	

	addUser: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				throw ApiError.BadRequest('Dont correct email or password!')
			}

			const body = req.body as IAddUser

			const link = await UserService.addUser(body)

			res.send(link)
		} catch (error) {
			next(error)
		}
	}

	removeUser: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { user_id } = req.body as { user_id: number }

			const user = await UserService.removeUser(user_id)

			res.send(user)
		} catch (error) {
			next(error)
		}
	}

	editUser: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const body = req.body as IEditUser

			const user = await UserService.editUser(body)

			res.send(user)
		} catch (error) {
			next(error)
		}
	}

	
}

export const UserConstroller = new UserControllerClass()
