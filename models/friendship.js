'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Friendship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Friendship.belongsTo(models.User, { foreignKey: 'uid' })
    }
  }
  Friendship.init({
    uid: DataTypes.INTEGER,
    fid: DataTypes.INTEGER
  }, {
    scopes: {
      findMyF (fid, nowUid) {
        return {
          where: {
            uid: nowUid,
            fid
          }
        }
      },
      listWithMe (fid, nowUid) {
        return {
          where: {
            uid: fid,
            fid: nowUid
          }
        }
      }
    },
    sequelize,
    modelName: 'Friendship',
    tableName: 'Friendships',
    underscored: true
  })
  return Friendship
}
