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
      User.hasMany(models.Friendship, { foreignKey: 'uid', as: 'Friends' })
      User.belongsToMany(User, {
        through: {
          model: models.Acquaintance,
          scope: {
            situation: 'pending'
          }
        },
        foreignKey: 'applierId', // 主體
        as: 'Applyings' // 我申請好友中的名單
      })
      User.belongsToMany(User, {
        through: {
          model: models.Acquaintance,
          scope: {
            situation: 'pending'
          }
        },
        foreignKey: 'accepterId', // 主體
        as: 'Thinkings' // 我考慮是否接受好友的名單
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
