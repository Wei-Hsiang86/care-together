'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
    */
    static associate (models) {
      User.hasMany(models.Patient, { foreignKey: 'userId' })
      User.belongsToMany(User, {
        through: models.Acquaintance,
        where: { situation: 'pending' },
        foreignKey: 'applierId',
        as: 'Applyings'
      })
      User.belongsToMany(User, {
        through: models.Acquaintance,
        where: { situation: 'pending' },
        foreignKey: 'accepterId',
        as: 'Thinkings'
      })
      User.belongsToMany(User, {
        through: models.Acquaintance,
        where: { situation: 'approved' },
        foreignKey: 'applierId',
        as: 'FriendsA'
      })
      User.belongsToMany(User, {
        through: models.Acquaintance,
        where: { situation: 'approved' },
        foreignKey: 'accepterId',
        as: 'FriendsB'
      })
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    photo: DataTypes.STRING,
    intro: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
