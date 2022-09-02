'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
        .then(() => {
            return queryInterface.createTable('MatchRoundTeamStats',
            {
                "id": {
                    "type": "INTEGER",
                    "allowNull": false,
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "kills": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "goldEarned": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "towersDestroyed": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "heraldsKilled": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "dragonsKilled": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "inhibitorsDestroyed": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "baronsKilled": {
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
            return queryInterface.dropTable('MatchRoundTeamStats');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        });
    }
};