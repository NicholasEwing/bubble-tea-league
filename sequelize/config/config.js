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
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    port: process.env.PROD_DB_PORT,
    dialect: "mysql",
  },
};
