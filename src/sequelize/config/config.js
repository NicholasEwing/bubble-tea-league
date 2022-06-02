module.exports = {
  development: {
    username: "root",
    password: "root",
    database: "btl_db",
    host: "localhost",
    port: 3306,
    dialect: "mysql",
  },
  // test: {
  //   username: process.env.CI_DB_USERNAME,
  //   password: process.env.CI_DB_PASSWORD,
  //   database: process.env.CI_DB_NAME,
  //   host: "127.0.0.1",
  //   port: 3306,
  //   dialect: "mysql",
  // },
  // production: {
  //   username: process.env.PROD_DB_USERNAME,
  //   password: process.env.PROD_DB_PASSWORD,
  //   database: process.env.PROD_DB_NAME,
  //   host: process.env.PROD_DB_HOSTNAME,
  //   port: process.env.PROD_DB_PORT,
  //   dialect: "mysql",
  // },
};
