module.exports = {
  test: {
    username: "root",
    password: "root",
    database: "btl_db_jest",
    host: "localhost",
    port: 3306,
    dialect: "mysql",
  },
  development: {
    username: "root",
    password: "root",
    database: "btl_db_jest",
    host: "localhost",
    port: 3306,
    dialect: "mysql",
  },
  production: {
    dialect: "mysql",
    use_env_variable: "DB_CONNECTION_STRING",
    ssl: true,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
      },
    },
  },
};
