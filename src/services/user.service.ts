import { Model } from 'sequelize'
import bcrypt from 'bcrypt'

import { RoleModel, UserModel } from '../models/index.model'
import { IStatistics, IUser, IUserDto } from '../types/user.type'
import { ApiError } from '../exceptions/api.error'
import { UserDto } from '../dtos/user.dto'
import { TokenService } from './token.service'
import { RoleService } from './role.service'

class UserServiceClass {
	static async returnData(user: Model<IUser>) {
		const userDto = new UserDto(user.dataValues)
		const tokens = TokenService.generateTokens(userDto)
		await TokenService.saveToken(
			tokens.refresh_token,
			Number(user.dataValues.id)
		)
		return { ...tokens, user: userDto }
	}

	async getUsers() {
		const users = await UserModel.findAll<Model<IUser>>({
			where: { fired: false }
		})
		return users
	}

	async getUsersStatistics() {
		const users = await UserModel.findAll<Model<IUser>>()

		const hired_employees = users.filter(
			user => user.dataValues.fired === false
		).length
		const fired_employees = users.filter(
			user => user.dataValues.fired === true
		).length

		const date = new Date()

		const upcomingSalaries = users
			.filter(user => user.dataValues.fired === false)
			.map(user => ({
				birth_date: user.dataValues.birth_date,
				salary_amount: user.dataValues.salary_amount
			}))

		const upcomingBirthdays = users
			.filter(user => {
				const dates = [...user.dataValues.hire_data]
					.slice(0, 10)
					.toString()
					.split('-')

				const today_score = (date.getMonth() + 1) * 32 + date.getDay()
				const month_later_score = (date.getMonth() + 2) * 32 + date.getDay()
				const hire_score = Number(dates[1]) * 32 + Number(dates[2])

				const is_birthday =
					today_score < hire_score && month_later_score >= hire_score

				if (is_birthday) {
					return true
				}

				return false
			})
			.map(user => ({ ...user.dataValues }))

		return {
			hired_employees,
			fired_employees,
			upcomingSalaries,
			upcomingBirthdays
		} as IStatistics
	}

	async refresh(refresh_token: string) {
		if (!refresh_token) {
			throw ApiError.UnautorizedError()
		}

		const is_valid_token = TokenService.validateRefreshToken(refresh_token)
		const tokeb_from_db = await TokenService.findToken(refresh_token)

		if (!is_valid_token || !tokeb_from_db) {
			throw ApiError.UnautorizedError()
		}

		const user = await UserModel.findOne<Model<IUser>>({
			where: { id: tokeb_from_db.dataValues.userId }
		})

		if (!user) {
			throw ApiError.BadRequest('User not found!')
		}

		return UserServiceClass.returnData(user)
	}

	async addUser({ userRoles, ...body }: IUserDto & { userRoles: string[] }) {
		const user = await UserModel.create<Model<IUserDto>>(body)

		await RoleService.addRole(userRoles, Number(user.dataValues.id))

		const link = `${process.env.CLIENT_URL}/password?_id=${user.dataValues.id}`

		return link
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

		return UserServiceClass.returnData(user)
	}

	async logout(refresh_token: string) {
		const token = await TokenService.removeToken(refresh_token)
		return token
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

	async removeUser(user_id: number) {
		const user = await UserModel.findOne<Model<IUser>>({
			where: { id: user_id }
		})

		if (!user) {
			throw ApiError.BadRequest('User not found!')
		}

		return await user?.update({ fired: true })
	}

	async editUser({ id: user_id, ...data }: IUser) {
		const user = await UserModel.findOne<Model<IUser>>({
			where: { id: user_id }
		})

		if (!user) {
			throw ApiError.BadRequest('User not found!')
		}

		return await user?.update(data)
	}
}

export const UserService = new UserServiceClass()
