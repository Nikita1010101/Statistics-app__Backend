import { Model } from 'sequelize'
import bcrypt from 'bcrypt'

import { RoleModel, UserModel } from '../models/index.model'
import { IStatistics, IUser } from '../types/user.type'
import { ApiError } from '../exceptions/api.error'
import { UserDto } from '../dtos/user.dto'
import { TokenService } from './token.service'

class UserServiceClass {
	static async returnData(user: Model<IUser>) {
		const userDto = new UserDto(user.dataValues)
		const tokens = TokenService.generateTokens(userDto)
		await TokenService.saveToken(tokens.refresh_token, user.dataValues.id)
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

		const upcomingSalaries = users.filter(user => {
			
		})

		const upcomingBirthdays = users.filter(user => {
			const [_, hire_month, hire_day] = user.dataValues.hire_data.split('-')

			const today_score = (date.getMonth() + 1) * 32 + date.getDay()
			const month_later_score = (date.getMonth() + 2) * 32 + date.getDay()
			const hire_score = Number(hire_month) * 32 + Number(hire_day)

			const is_birthday =
				today_score < hire_score && month_later_score >= hire_score

			if (is_birthday) {
				return true
			}

			return false
		})

		return {
			hired_employees,
			fired_employees,
			upcomingSalaries,
			upcomingBirthdays
		} as IStatistics
	}

	async addUser(body: IUser) {
		const user = await UserModel.create<Model<IUser>>(body)

		const link = `${process.env.APP_URL}/password?_id=${user.dataValues.id}`

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
			throw ApiError.BadRequest("Don't correct password!")
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
