"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("leads", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      companyName: { type: Sequelize.STRING, allowNull: false },
      contactPerson: { type: Sequelize.STRING, allowNull: false },
      corporateEmail: { type: Sequelize.STRING, allowNull: false },
      internationalPhone: { type: Sequelize.STRING, allowNull: false },
      targetedVerticals: { type: Sequelize.JSON, allowNull: false },
      leadDeliveryClass: { type: Sequelize.JSON, allowNull: false },
      weeklyVolumeAllocation: { type: Sequelize.STRING, allowNull: false },
      preferredDeliveryMechanism: { type: Sequelize.STRING, allowNull: false },
      operationalNotes: { type: Sequelize.TEXT, allowNull: true },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "new",
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addIndex("leads", ["corporateEmail"]);
    await queryInterface.addIndex("leads", ["status"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("leads");
  },
};
