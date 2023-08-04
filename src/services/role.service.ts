import { Model } from 'sequelize'

import { RoleModel } from '../models/index.model'
import { IRole } from '../types/role.type'

class RoleServiceClass {
	async addRole(userRoles: string[], user_id: number) {
		userRoles.forEach(role => {
			RoleModel.create<Model<IRole>>({ role, userId: user_id })
		})
	}
}

export const RoleService = new RoleServiceClass()
