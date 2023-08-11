import { Model } from 'sequelize'

import { IUser } from '../types/user.type'

export const createUpcomingBirthdays = (users: Model<IUser>[]) => {
	const date = new Date()

	const upcomingBirthdays = users
		.filter(user => {
			const hire_data = user.dataValues.hire_date

			const month = Number(hire_data[5] + hire_data[6])
			const day = Number(hire_data[8] + hire_data[9])

			const current_month = date.getMonth()
			const current_day = date.getDay()

			const is_birthday =
				(current_month === month && current_day <= day) ||
				(current_month + 1 === month && current_day >= day)

			if (is_birthday) {
				return true
			}

			return false
		})
		.map(user => ({ ...user.dataValues }))

	return upcomingBirthdays
}
