import { NextFunction, Request, Response } from 'express'
import { ApiError } from '../exceptions/api.error'
import { TokenService } from '../services/token.service'
import { IUserDto } from '../types/user.type'

export const authMiddleWare = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const autorization_header = req.headers.authorization

		if (!autorization_header) {
			throw next(ApiError.UnautorizedError())
		}

		const access_token = autorization_header.split(' ')[1]

		if (!access_token) {
			throw next(ApiError.UnautorizedError())
		}

		const user = TokenService.validateAccessToken(access_token)

		if (!user) {
			throw next(ApiError.UnautorizedError())
		}

		(req as Request & { user: IUserDto }).user = user

		next()
	} catch (error) {
		next(ApiError.UnautorizedError())
	}
}
