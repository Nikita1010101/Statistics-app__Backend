import { DataTypes } from 'sequelize'

export const roleModelData = {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	},
	role: { type: DataTypes.STRING, allowNull: false }
}
