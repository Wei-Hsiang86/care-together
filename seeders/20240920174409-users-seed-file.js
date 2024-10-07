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
      intro: 'Hello, I am root!',
      danger: false
    }], {})

    const users = Array.from({ length: 9 }, (_, i) => ({
      email: `user${i + 1}@example.com`,
      password: bcrypt.hash('123456', 8),
      is_admin: false,
      name: `user${i + 1}`,
      created_at: new Date(),
      updated_at: new Date(),
      danger: false
    }))

    const hashedUsers = await Promise.all(users.map(async user => ({
      ...user,
      password: await user.password
    })))

    await queryInterface.bulkInsert('Users', hashedUsers, {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
