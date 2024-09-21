'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Patient.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Patient.init({
    temperature: DataTypes.FLOAT,
    heartRate: DataTypes.STRING,
    bloodPressure: DataTypes.STRING,
    gluac: DataTypes.STRING,
    glupc: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Patient',
    tableName: 'Patients',
    underscored: true
  })
  return Patient
}
