'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
        .then(() => {
            return queryInterface.createTable('MatchRoundPlayerStats',
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
                "assists": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "deaths": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "champLevel": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "goldEarned": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "visionScore": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "firstBlood": {
                    "type": "TINYINT(1)",
                    "allowNull": false
                },
                "totalDmgToChamps": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "kda": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "championName": {
                    "type": "VARCHAR(255)",
                    "allowNull": false
                },
                "championTransform": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false,
                    "defaultValue": 0
                },
                "item0": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "item1": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "item2": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "item3": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "item4": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "item5": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "item6": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "summoner1Id": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "summoner2Id": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "teamPosition": {
                    "type": "VARCHAR(255)",
                    "allowNull": false
                },
                "totalMinionsKilled": {
                    "type": "INTEGER",
                    "allowNull": false
                },
                "statPerks": {
                    "type": "VARCHAR(255)",
                    "allowNull": false
                },
                "primaryRunePath": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "primaryRunePerks": {
                    "type": "VARCHAR(255)",
                    "allowNull": false
                },
                "secondaryRunePath": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "secondaryRunePerks": {
                    "type": "VARCHAR(255)",
                    "allowNull": false
                },
                "killParticipation": {
                    "type": "VARCHAR(255)",
                    "allowNull": false
                },
                "teamDamagePercentage": {
                    "type": "VARCHAR(255)",
                    "allowNull": false
                },
                "wardsPlaced": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "wardTakedowns": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "summonerName": {
                    "type": "VARCHAR(255)",
                    "allowNull": false
                },
                "attackDamage": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "abilityPower": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "attackSpeed": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "lifesteal": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "armor": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "magicResist": {
                    "type": "INTEGER UNSIGNED",
                    "allowNull": false
                },
                "teamSide": {
                    "type": "VARCHAR(255)",
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
            return queryInterface.dropTable('MatchRoundPlayerStats');
        })
        .then(() => {
            return queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        });
    }
};