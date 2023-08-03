import { Model } from "sequelize"

export interface IUserDto {
	id: number
	full_name: string
	birth_date: string
	position: string
	salary_amount: number
	hire_data: string
	fired: boolean
	roles: string[]
}

export interface IUser extends IUserDto {
	password: string | null
}

export interface IStatistics {
	hired_employees: number
	fired_employees: number
	upcomingSalaries: Model<IUser>[]
	upcomingBirthdays: Model<IUser>[]
}

