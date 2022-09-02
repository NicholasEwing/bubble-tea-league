'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
        .then(() => {
            return queryInterface.createTable('Players',
            {
                "id": {
                    "type": "INTEGER",
                    "allowNull": false,
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "PUUID": {
                    "type": "VARCHAR(255)",
                    "unique": true,
                    "allowNull": false
                },
                "summonerName": {
                    "type": "VARCHAR(255)",
                    "unique": true,
                    "allowNull": false
                },
                "discordName": {
                    "type": "VARCHAR(255)",
                    "unique": true,
                    "allowNull": false
                },
                "email": {
                    "type": "VARCHAR(255)",
                    "unique": true
                },
                "firstName": {
                    "type": "VARCHAR(255)"
                },
                "lastName": {
                    "type": "VARCHAR(255)"
                },
                "isFreeAgent": {
                    "type": "TINYINT(1)",
                    "allowNull": false,
                    "defaultValue": false
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
            return queryInterface.dropTable('Players');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        });
    }
};