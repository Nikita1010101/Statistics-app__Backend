import { DataTypes } from 'sequelize'

export const tokenModelData = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	},
  refresh_token: { type: DataTypes.STRING, allowNull: false }
}
