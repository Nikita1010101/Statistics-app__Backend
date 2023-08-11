import { IRole } from './role.type'

export interface IUserDto {
	id?: number
	full_name: string
	birth_date: string
	position: string
	salary_amount: number
	hire_date: string
	fired: boolean
	roles?: IRole[]
}

export interface IUser extends IUserDto {
	password: string | null
}

export interface IAddUser extends IUserDto {
	userRoles: string[]
}

export interface IEditUser extends Partial<IUserDto> {
	user_id: number
}

export interface IStatistics {
	hired_employees: number
	fired_employees: number
	upcomingSalaries: IUpcomingSalaries[]
	upcomingBirthdays: IUser[]
}

export interface IUpcomingSalaries {
	month: string
	salaries_amount: number
}
