'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('users', {
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'user',
      },
      resetPasswordToken: {
        type: Sequelize.STRING,
      },
      resetPasswordExpire: {
        type: Sequelize.DATE,
      },
      confirmEmailToken: {
        type: Sequelize.STRING,
      },
      confirmPhoneToken: {
        type: Sequelize.STRING,
      },
      isEmailConfirmed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isPhoneConfirmed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('users');
  },
};
