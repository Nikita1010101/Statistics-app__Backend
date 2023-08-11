import { IRole } from '../types/role.type'
import { IUser } from '../types/user.type'

export class UserDto {
	public id: number
	public full_name: string
	public birth_date: string
	public position: string
	public salary_amount: number
	public hire_date: string
	public fired: boolean
	public roles: IRole[]

	constructor({
		id,
		full_name,
		birth_date,
		position,
		salary_amount,
		hire_date,
		fired,
		roles
	}: IUser) {
		this.id = Number(id)
		this.full_name = full_name
		this.birth_date = birth_date
		this.position = position
		this.salary_amount = salary_amount
		this.hire_date = hire_date
		this.fired = fired
		this.roles = roles || ([] as IRole[])
	}
}
