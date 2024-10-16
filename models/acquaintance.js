'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Acquaintance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  Acquaintance.init({
    situation: DataTypes.STRING,
    accepterId: DataTypes.INTEGER,
    applierId: DataTypes.INTEGER
  }, {
    scopes: {
      findApplyF (fid, nowUid) {
        return {
          where: {
            situation: 'pending',
            accepterId: fid,
            applierId: nowUid
          }
        }
      },
      findThinkF (fid, nowUid) {
        return {
          where: {
            situation: 'pending',
            accepterId: nowUid,
            applierId: fid
          }
        }
      },
      findApproveAp (fid, nowUid) {
        return {
          where: {
            situation: 'approved',
            accepterId: fid,
            applierId: nowUid
          }
        }
      },
      findApproveAc (fid, nowUid) {
        return {
          where: {
            situation: 'approved',
            accepterId: nowUid,
            applierId: fid
          }
        }
      }
    },
    sequelize,
    modelName: 'Acquaintance',
    tableName: 'Acquaintances',
    underscored: true
  })
  return Acquaintance
}
