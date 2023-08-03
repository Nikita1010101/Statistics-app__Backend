import { DataTypes } from 'sequelize'

export const userModelData = {
	id: {
		type: DataTypes.INTEGER,
		primarykey: true,
		autoIncrement: true,
		allowNull: false
	},
	full_name: { type: DataTypes.STRING, allowNull: false },
	birth_date: { type: DataTypes.DATE, allowNull: false },
	position: { type: DataTypes.STRING, allowNull: false },
	salary_amount: { type: DataTypes.INTEGER, allowNull: false },
	hire_data: { type: DataTypes.DATE, allowNull: false },
	password: { type: DataTypes.STRING },
	fired: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}
