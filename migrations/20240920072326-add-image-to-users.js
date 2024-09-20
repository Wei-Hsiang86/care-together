'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 使用 transaction 確保兩個操作的資料正確性
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn('Users', 'photo', { type: Sequelize.STRING }, { transaction })
      await queryInterface.addColumn('Users', 'intro', { type: Sequelize.TEXT }, { transaction })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeColumn('Users', 'photo', { transaction })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
