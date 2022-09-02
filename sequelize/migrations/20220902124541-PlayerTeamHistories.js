'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
        .then(() => {
            return queryInterface.createTable('PlayerTeamHistories',
            {
                "id": {
                    "type": "INTEGER",
                    "primaryKey": true,
                    "autoIncrement": true,
                    "allowNull": false
                },
                "role": {
                    "type": "VARCHAR(255)",
                    "allowNull": true,
                    "defaultValue": "Fill"
                }
            })
        })

        .then(() => {
            return queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        });
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
        .then(() => {
            return queryInterface.dropTable('PlayerTeamHistories');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        });
    }
};