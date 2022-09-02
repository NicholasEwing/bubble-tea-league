'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
        .then(() => {
            return queryInterface.createTable('Seasons',
            {
                "number": {
                    "type": "INTEGER UNSIGNED",
                    "primaryKey": true,
                    "autoIncrement": true,
                    "unique": true,
                    "allowNull": false
                },
                "tournamentId": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false,
                    "unique": true
                },
                "year": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "createdAt": {
                    "type": "DATETIME",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": "DATETIME",
                    "allowNull": false
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
            return queryInterface.dropTable('Seasons');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        });
    }
};