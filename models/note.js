'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Note.belongsTo(models.User, { foreignKey: 'userId' })
      Note.belongsTo(models.Patient, { foreignKey: 'patientId' })
    }
  }
  Note.init({
    text: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    patientId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Note',
    tableName: 'Notes',
    underscored: true
  })
  return Note
}
