import { sequelize } from '../db'
import { roleModelData } from './role.model'
import { tokenModelData } from './token.model'
import { userModelData } from './user.model'

const UserModel = sequelize.define('user', userModelData)
const TokenModel = sequelize.define('token', tokenModelData)
const RoleModel = sequelize.define('role', roleModelData)

UserModel.hasOne(TokenModel)
TokenModel.belongsTo(UserModel)

UserModel.hasMany(RoleModel)
RoleModel.belongsTo(UserModel)

export { UserModel, TokenModel, RoleModel }
