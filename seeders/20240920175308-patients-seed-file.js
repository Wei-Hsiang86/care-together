'use strict'
const faker = require('faker')

function getRandomInt (max) {
  return Math.floor(Math.random() * max)
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Patients',
      Array.from({ length: 50 }, () => ({
        temperature: 35 + getRandomInt(41) / 10,
        heart_rate: 55 + getRandomInt(51),
        blood_pressure: `${55 + getRandomInt(31)} / ${85 + getRandomInt(41)}`,
        gluac: 65 + getRandomInt(41),
        glupc: 68 + getRandomInt(81),
        description: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
        user_id: users[Math.floor(Math.random() * (users.length - 1) + 1)].id
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Patients', {})
  }
}
