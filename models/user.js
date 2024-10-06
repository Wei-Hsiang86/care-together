'use strict'
const { Op } = require('sequelize')
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
      // 暫時讓 User 跟 Friendship 設定成一對多，而非多對多
      // 因為對 fid 查 uid 這個關係目前而言是沒有意義的
      User.hasMany(models.Friendship, { foreignKey: 'uid', as: 'Friends' })
      User.hasMany(models.Comment, { foreignKey: 'userId' })
      User.hasMany(models.Note, { foreignKey: 'userId' })
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
    scopes: {
      findFriendInfo (list) {
        return {
          where: {
            id: {
              [Op.in]: list
            }
          },
          attributes: {
            exclude: ['password']
          },
          raw: true
        }
      }
    },
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
