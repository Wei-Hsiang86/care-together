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
    sequelize,
    modelName: 'Friendship',
    tableName: 'Friendships',
    underscored: true
  })
  return Friendship
}
