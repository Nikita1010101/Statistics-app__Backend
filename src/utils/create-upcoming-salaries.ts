import { EMonths } from '../types/date.type'
import { IUpcomingSalaries, IUser } from '../types/user.type'

export const createUpcomingSalaries = (users: IUser[]) => {
	const upcomingSalaries: IUpcomingSalaries[] = [
		{
			month: EMonths.JAN,
			salaries_amount: 0
		},
		{
			month: EMonths.FEB,
			salaries_amount: 0
		},
		{
			month: EMonths.MAR,
			salaries_amount: 0
		},
		{
			month: EMonths.APR,
			salaries_amount: 0
		},
		{
			month: EMonths.MAY,
			salaries_amount: 0
		},
		{
			month: EMonths.JUN,
			salaries_amount: 0
		},
		{
			month: EMonths.JUL,
			salaries_amount: 0
		},
		{
			month: EMonths.AUG,
			salaries_amount: 0
		},
		{
			month: EMonths.SEP,
			salaries_amount: 0
		},
		{
			month: EMonths.OCT,
			salaries_amount: 0
		},
		{
			month: EMonths.NOV,
			salaries_amount: 0
		},
		{
			month: EMonths.DEC,
			salaries_amount: 0
		},
		{
			month: EMonths.JUN,
			salaries_amount: 0
		}
	]

	upcomingSalaries.forEach((_, current_month) => {
		const total_salary = users
			.filter(user => user.fired === false)
			.reduce((sum, user) => {
				const hire_date = user.hire_date

				const month = Number(hire_date[5] + hire_date[6]) - 1

				if (current_month >= month) {
					const salaries_amount = user.salary_amount

					sum += salaries_amount
				}

				return sum
			}, 0)

		upcomingSalaries[current_month].salaries_amount += total_salary
	})

	return upcomingSalaries
}
