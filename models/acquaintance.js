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
    sequelize,
    modelName: 'Acquaintance',
    tableName: 'Acquaintances',
    underscored: true
  })
  return Acquaintance
}
