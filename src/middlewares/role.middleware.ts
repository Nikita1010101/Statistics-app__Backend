import { NextFunction, Request, Response } from 'express'
import { ApiError } from '../exceptions/api.error'
import { TokenService } from '../services/token.service'

export const roleMiddleWare = (roles: string[]) => {
	return function(req: Request, res: Response, next: NextFunction) {
		try {
			if (req.method === 'OPTIONS') {
				next()
			}

			const autorization_header = req.headers.authorization

			if (!autorization_header) {
				throw next(ApiError.UnautorizedError())
			}

			const access_token = autorization_header.split(' ')[1]

			if (!access_token) {
				throw next(ApiError.UnautorizedError())
			}

			const { roles: userRoles } =
				TokenService.validateAccessToken(access_token)

			if (!userRoles) {
				throw next(ApiError.UnautorizedError())
			}

			let hasRole = false

			userRoles.forEach(role => {
				if (roles.includes(role)) {
					hasRole = true
				}
			})

			if (!hasRole) {
				throw next(ApiError.Forbidden('You don"t have access!'))
			}

			next()
		} catch (error) {
			throw next(ApiError.UnautorizedError())
		}
	}
}
