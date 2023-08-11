import { NextFunction, Request, RequestHandler, Response } from 'express'

import { AuthService } from '../services/auth.service'
import { ILoginBody } from '../types/auth.type'

class AuthControllerClass {
	static setCookie(res: Response, refresh_token: string) {
		res.cookie('refresh_token', refresh_token, {
			maxAge: 1000 * 60 * 60 * 24 * 30,
			httpOnly: true
		})
	}

	login: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { user_id, password } = req.body as ILoginBody

			const user = await AuthService.login(Number(user_id), String(password))

			AuthControllerClass.setCookie(res, user.refresh_token)

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
			const { refresh_token } = req.cookies as { refresh_token: string }

			const token = await AuthService.logout(refresh_token)

			res.clearCookie('refresh_token')

			res.send(String(token))
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
			const { user_id, password } = req.body as ILoginBody

			await AuthService.setPassword(Number(user_id), String(password))

			res.send({})
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
			const { refresh_token } = req.cookies

			const user = await AuthService.refresh(refresh_token)

			AuthControllerClass.setCookie(res, user.refresh_token)

			res.send(user)
		} catch (error) {
			next(error)
		}
	}
}

export const AuthController = new AuthControllerClass()
