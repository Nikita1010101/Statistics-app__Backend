import { NextFunction, Request, Response } from 'express'
import { ApiError } from '../exceptions/api.error'
import { TokenService } from '../services/token.service'
import { IUserDto } from '../types/user.type'

export const roleMiddleWare = (roles: string[]) => {
	return function (req: Request, res: Response, next: NextFunction) {
		try {
			if (req.method === 'OPTIONS') {
				next()
			}

			const autorization_header = req.headers.authorization

		if (!autorization_header) {
			return next(ApiError.UnautorizedError())
		}

		const access_token = autorization_header.split(' ')[1]

		if (!access_token) {
			return next(ApiError.UnautorizedError())
		}

		const user = TokenService.validateAccessToken(access_token) as IUserDto

		if (!user) {
			return next(ApiError.UnautorizedError())
		}

			const hasRole = user.roles?.some(item => roles.includes(item.role))

			if (!hasRole) {
				throw next(ApiError.Forbidden('You don"t have access!'))
			}

			next()
		} catch (error) {
			throw next(ApiError.UnautorizedError())
		}
	}
}
