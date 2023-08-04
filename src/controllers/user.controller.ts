import { NextFunction, Request, RequestHandler, Response } from 'express'
import { validationResult } from 'express-validator'

import { ApiError } from '../exceptions/api.error'
import { UserService } from '../services/user.service'
import { IUser, IUserDto } from '../types/user.type'

class UserConstrollerClass {
	static setCookie(res: Response, refresh_token: string) {
		res.cookie('refresh_token', refresh_token, {
			maxAge: 1000 * 60 * 60 * 24 * 30,
			httpOnly: true
		})
	}

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

	getUsersStatistics: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const statistics = await UserService.getUsersStatistics()

			res.send(statistics)
		} catch (error) {
			next(error)
		}
	}

	refresh: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { refresh_token } = req.cookies as { refresh_token: string }

			const user = await UserService.refresh(refresh_token)

			UserConstrollerClass.setCookie(res, user.refresh_token)

			res.send(user)
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

			const body = req.body as IUserDto & { userRoles: string[] }

			const link = await UserService.addUser(body)

			res.send(link)
		} catch (error) {
			next(error)
		}
	}

	deleteUser: RequestHandler = async (
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
			const body = req.body as IUser

			const user = await UserService.editUser(body)

			res.send(user)
		} catch (error) {
			next(error)
		}
	}

	login: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { id, password } = req.body as IUser

			const user = await UserService.login(Number(id), String(password))

			UserConstrollerClass.setCookie(res, user.refresh_token)

			res.send(user)
		} catch (error) {
			next(error)
		}
	}

	logout: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { refresh_token } = req.params as { refresh_token: string }

			const token = await UserService.logout(refresh_token)

			res.clearCookie('refresh_token')

			res.send(token)
		} catch (error) {
			next(error)
		}
	}

	setPassword: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { id, password } = req.body as IUser

			await UserService.setPassword(Number(id), String(password))

			res.send('All ok)')
			const redirect_path = `${process.env.CLIENT_URL}/login`

			res.redirect(redirect_path)
		} catch (error) {
			next(error)
		}
	}
}

export const UserConstroller = new UserConstrollerClass()
