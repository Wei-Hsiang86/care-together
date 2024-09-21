'use strict'
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: await bcrypt.hash('123456', 8),
      is_admin: true,
      name: 'root',
      created_at: new Date(),
      updated_at: new Date(),
      intro: 'Hello, I am root!'
    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('123456', 8),
      is_admin: false,
      name: 'user1',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user2@example.com',
      password: await bcrypt.hash('123456', 8),
      is_admin: false,
      name: 'user2',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user3@example.com',
      password: await bcrypt.hash('123456', 8),
      is_admin: false,
      name: 'user3',
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
