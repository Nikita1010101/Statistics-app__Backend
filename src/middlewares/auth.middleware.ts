import { NextFunction, Request, Response } from 'express'

import { ApiError } from '../exceptions/api.error'
import { TokenService } from '../services/token.service'

export const authMiddleWare = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const autorization_header = req.headers.authorization

		if (!autorization_header) {
			return next(ApiError.UnautorizedError())
		}

		const access_token = autorization_header.split(' ')[1]

		if (!access_token) {
			return next(ApiError.UnautorizedError())
		}

		const user = TokenService.validateAccessToken(access_token)

		if (!user) {
			return next(ApiError.UnautorizedError())
		}

		next()
	} catch (error) {
		return next(ApiError.UnautorizedError())
	}
}
