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
      Patient.hasMany(models.comment, { foreignKey: 'patientId' })
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
    scopes: {
      contestData (uid) {
        return {
          where: { userId: uid },
          attributes: { exclude: ['description'] },
          order: [['createdAt', 'DESC']],
          raw: true,
          nest: true
        }
      },
      patientData (model) {
        return {
          include: {
            model: model,
            attributes: ['name']
          },
          raw: true,
          nest: true
        }
      }
    },
    sequelize,
    modelName: 'Patient',
    tableName: 'Patients',
    underscored: true
  })
  return Patient
}
