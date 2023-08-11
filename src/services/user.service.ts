import { Model } from 'sequelize'

import { UserModel } from '../models/index.model'
import { IAddUser, IEditUser, IStatistics, IUser, IUserDto } from '../types/user.type'
import { ApiError } from '../exceptions/api.error'
import { RoleService } from './role.service'
import { createUpcomingSalaries } from '../utils/create-upcoming-salaries'
import { createUpcomingBirthdays } from '../utils/create-upcoming-birthdays'

class UserServiceClass {
	async getUsers() {
		const users = await UserModel.findAll<Model<IUser>>({
			where: { fired: false }
		})
		return users
	}

	async getStatistics() {
		const users = await UserModel.findAll<Model<IUser>>()

		const hired_employees = users.filter(
			user => user.dataValues.fired === false
		).length

		const fired_employees = users.filter(
			user => user.dataValues.fired === true
		).length

		const newUsers = users.map(user => user.dataValues)

		const upcomingSalaries = createUpcomingSalaries(newUsers)

		const upcomingBirthdays = createUpcomingBirthdays(users)

		return {
			hired_employees,
			fired_employees,
			upcomingSalaries,
			upcomingBirthdays
		} as IStatistics
	}

	async addUser({ userRoles, ...body }: IAddUser) {
		const user = await UserModel.create<Model<IAddUser, IUserDto>>({
			...body,
			fired: false
		})

		await RoleService.addRole(userRoles, Number(user.dataValues.id))

		const link = `${process.env.CLIENT_URL}/password?_user_id=${user.dataValues.id}`

		return link
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

	async editUser({ user_id, ...data }: IEditUser) {
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
