'use strict'
const faker = require('faker')

function getRandomInt (max) {
  return Math.floor(Math.random() * max)
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Patients',
      Array.from({ length: 50 }, () => ({
        temperature: 35 + getRandomInt(41) / 10,
        heart_rate: 55 + getRandomInt(51),
        blood_pressure: `${55 + getRandomInt(31)} / ${85 + getRandomInt(41)}`,
        gluac: 65 + getRandomInt(41),
        glupc: 68 + getRandomInt(81),
        description: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Patients', {})
  }
}
