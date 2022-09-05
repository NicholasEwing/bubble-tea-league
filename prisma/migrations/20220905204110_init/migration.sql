-- CreateTable
CREATE TABLE `MatchRoundPlayerStats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kills` INTEGER UNSIGNED NOT NULL,
    `assists` INTEGER UNSIGNED NOT NULL,
    `deaths` INTEGER UNSIGNED NOT NULL,
    `champLevel` INTEGER UNSIGNED NOT NULL,
    `goldEarned` INTEGER UNSIGNED NOT NULL,
    `visionScore` INTEGER UNSIGNED NOT NULL,
    `firstBlood` BOOLEAN NOT NULL,
    `totalDmgToChamps` INTEGER UNSIGNED NOT NULL,
    `kda` INTEGER UNSIGNED NOT NULL,
    `championName` VARCHAR(255) NOT NULL,
    `championTransform` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `item0` INTEGER UNSIGNED NOT NULL,
    `item1` INTEGER UNSIGNED NOT NULL,
    `item2` INTEGER UNSIGNED NOT NULL,
    `item3` INTEGER UNSIGNED NOT NULL,
    `item4` INTEGER UNSIGNED NOT NULL,
    `item5` INTEGER UNSIGNED NOT NULL,
    `item6` INTEGER UNSIGNED NOT NULL,
    `summoner1Id` INTEGER UNSIGNED NOT NULL,
    `summoner2Id` INTEGER UNSIGNED NOT NULL,
    `teamPosition` VARCHAR(255) NOT NULL,
    `totalMinionsKilled` INTEGER NOT NULL,
    `statPerks` VARCHAR(255) NOT NULL,
    `primaryRunePath` INTEGER UNSIGNED NOT NULL,
    `primaryRunePerks` VARCHAR(255) NOT NULL,
    `secondaryRunePath` INTEGER UNSIGNED NOT NULL,
    `secondaryRunePerks` VARCHAR(255) NOT NULL,
    `killParticipation` VARCHAR(255) NOT NULL,
    `teamDamagePercentage` VARCHAR(255) NOT NULL,
    `wardsPlaced` INTEGER UNSIGNED NOT NULL,
    `wardTakedowns` INTEGER UNSIGNED NOT NULL,
    `summonerName` VARCHAR(255) NOT NULL,
    `attackDamage` INTEGER UNSIGNED NOT NULL,
    `abilityPower` INTEGER UNSIGNED NOT NULL,
    `attackSpeed` INTEGER UNSIGNED NOT NULL,
    `lifesteal` INTEGER UNSIGNED NOT NULL,
    `armor` INTEGER UNSIGNED NOT NULL,
    `magicResist` INTEGER UNSIGNED NOT NULL,
    `teamSide` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `matchRoundId` INTEGER NOT NULL,
    `playerId` INTEGER NOT NULL,

    INDEX `MatchRoundPlayerStats_matchRoundId_playerId_idx`(`matchRoundId`, `playerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MatchRoundTeamStats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kills` INTEGER UNSIGNED NOT NULL,
    `goldEarned` INTEGER UNSIGNED NOT NULL,
    `towersDestroyed` INTEGER UNSIGNED NOT NULL,
    `heraldsKilled` INTEGER UNSIGNED NOT NULL,
    `dragonsKilled` INTEGER UNSIGNED NOT NULL,
    `inhibitorsDestroyed` INTEGER UNSIGNED NOT NULL,
    `baronsKilled` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `matchRoundId` INTEGER NOT NULL,
    `teamId` INTEGER NOT NULL,

    INDEX `MatchRoundTeamStats_matchRoundId_teamId_idx`(`matchRoundId`, `teamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MatchRound` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `gameId` VARCHAR(255) NULL,
    `tournamentCode` VARCHAR(255) NOT NULL,
    `metaData` VARCHAR(255) NULL,
    `gameDuration` INTEGER UNSIGNED NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `winningTeamId` INTEGER NULL,
    `redTeamId` INTEGER NULL,
    `blueTeamId` INTEGER NULL,
    `matchId` INTEGER NOT NULL,

    INDEX `MatchRound_winningTeamId_redTeamId_blueTeamId_idx`(`winningTeamId`, `redTeamId`, `blueTeamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Match` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `isPlayoffsMatch` BOOLEAN NOT NULL,
    `isUpperBracket` BOOLEAN NULL,
    `bracketRound` INTEGER UNSIGNED NULL,
    `scheduledTime` DATETIME(0) NULL,
    `vodLink` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `seasonId` INTEGER UNSIGNED NOT NULL,
    `matchWinnerTeamId` INTEGER NULL,
    `matchLoserTeamId` INTEGER NULL,
    `teamOneId` INTEGER NULL,
    `teamTwoId` INTEGER NULL,

    UNIQUE INDEX `vodLink`(`vodLink`),
    INDEX `Match_matchWinnerTeamId_matchLoserTeamId_teamOneId_teamTwoId_idx`(`matchWinnerTeamId`, `matchLoserTeamId`, `teamOneId`, `teamTwoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlayerTeamHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role` VARCHAR(255) NULL DEFAULT 'Fill',
    `playerId` INTEGER NULL,

    INDEX `PlayerTeamHistory_playerId_idx`(`playerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Player` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `PUUID` VARCHAR(255) NOT NULL,
    `summonerName` VARCHAR(255) NOT NULL,
    `discordName` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NULL,
    `firstName` VARCHAR(255) NULL,
    `lastName` VARCHAR(255) NULL,
    `isFreeAgent` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PUUID`(`PUUID`),
    UNIQUE INDEX `summonerName`(`summonerName`),
    UNIQUE INDEX `discordName`(`discordName`),
    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Provider` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `providerId` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `providerId`(`providerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Season` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tournamentId` INTEGER UNSIGNED NOT NULL,
    `year` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tournamentId`(`tournamentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeamStanding` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `placement` INTEGER NOT NULL,
    `teamId` INTEGER NOT NULL,

    UNIQUE INDEX `TeamStanding_teamId_key`(`teamId`),
    INDEX `TeamStanding_teamId_idx`(`teamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Team` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teamName` VARCHAR(255) NOT NULL,
    `logoImgPath` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `tricode` VARCHAR(255) NULL,
    `seasonId` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `teamName`(`teamName`),
    UNIQUE INDEX `tricode`(`tricode`),
    INDEX `Team_seasonId_idx`(`seasonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
