import { IUser } from '../types/user.type'

export class UserDto {
	public id: number
	public full_name: string
	public birth_date: string
	public position: string
	public salary_amount: number
	public hire_data: string
	public fired: boolean
	public roles: string[]

	constructor({
		id,
		full_name,
		birth_date,
		position,
		salary_amount,
		hire_data,
		fired,
		roles
	}: IUser) {
		this.id = Number(id)
		this.full_name = full_name
		this.birth_date = birth_date
		this.position = position
		this.salary_amount = salary_amount
		this.hire_data = hire_data
		this.fired = fired
		this.roles = roles || ([] as string[])
	}
}
