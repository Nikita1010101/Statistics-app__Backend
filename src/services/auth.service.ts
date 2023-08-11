import { Model } from 'sequelize'
import bcrypt from 'bcrypt'

import { RoleModel, UserModel } from '../models/index.model'
import { IUser } from '../types/user.type'
import { ApiError } from '../exceptions/api.error'
import { TokenService } from './token.service'
import { UserDto } from '../dtos/user.dto'

class AuthServiceClass {
	static async returnData(user: Model<IUser>) {
		const userDto = new UserDto(user.dataValues)
		const tokens = TokenService.generateTokens(userDto)
		await TokenService.saveToken(
			tokens.refresh_token,
			Number(user.dataValues.id)
		)
		return { ...tokens, user: userDto }
	}

	async setPassword(user_id: number, password: string) {
		const user = await UserModel.findOne<Model<IUser>>({
			where: { id: user_id }
		})

		if (!user) {
			throw ApiError.BadRequest('User not found!')
		}

		const hash_password = await bcrypt.hash(password, 2)

		await user.update({ password: hash_password })
	}

	async refresh(refresh_token: string) {
		if (!refresh_token) {
			throw ApiError.UnautorizedError()
		}

		const is_valid_token = TokenService.validateRefreshToken(refresh_token)
		const token_from_db = await TokenService.findToken(refresh_token)

		if (!is_valid_token || !token_from_db) {
			throw ApiError.UnautorizedError()
		}

		const user = await UserModel.findOne<Model<IUser>>({
			where: { id: token_from_db.dataValues.userId },
			include: { model: RoleModel, as: 'roles' }
		})

		if (!user) {
			throw ApiError.BadRequest('User not found!')
		}

		return AuthServiceClass.returnData(user)
	}

	async login(user_id: number, password: string) {
		const user = await UserModel.findOne<Model<IUser>>({
			where: { id: user_id },
			include: { model: RoleModel, as: 'roles' }
		})

		if (!user) {
			throw ApiError.BadRequest('User not found!')
		}

		const is_passwords_equals = await bcrypt.compare(
			password,
			String(user.dataValues.password)
		)

		if (!is_passwords_equals) {
			throw ApiError.BadRequest('Don"t correct password!')
		}

		return AuthServiceClass.returnData(user)
	}

	async logout(refresh_token: string) {
		if (!refresh_token) {
			throw ApiError.UnautorizedError()
		}

		const token = await TokenService.removeToken(refresh_token)

		if (!token) {
			throw ApiError.UnautorizedError()
		}

		return token
	}
}

export const AuthService = new AuthServiceClass()
