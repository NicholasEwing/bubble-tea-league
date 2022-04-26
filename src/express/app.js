const express = require("express");
const bodyParser = require("body-parser");

const routes = {
  teams: require("./routes/teams"),
  players: require("./routes/players"),
  matches: require("./routes/matches"),
  "match-rounds": require("./routes/match-rounds"),
  seasons: require("./routes/seasons"),
  // Add more routes here like so...
  // items: require('./routes/items'),
};

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// We create a wrapper to workaround async errors not being transmitted correctly.
function makeHandlerAwareOfAsyncErrors(handler) {
  return async function (req, res, next) {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
}

// We define the standard REST APIs for each route (if they exist).
for (const [routeName, routeController] of Object.entries(routes)) {
  // TODO: automatically convert camelCase routeNames to kebab-case
  // i.e. matchRounds -> match-rounds
  if (routeController.getAll) {
    app.get(
      `/api/${routeName}`,
      makeHandlerAwareOfAsyncErrors(routeController.getAll)
    );
  }
  if (routeController.getById) {
    app.get(
      `/api/${routeName}/:id`,
      makeHandlerAwareOfAsyncErrors(routeController.getById)
    );
  }
  if (routeController.create) {
    app.post(
      `/api/${routeName}`,
      makeHandlerAwareOfAsyncErrors(routeController.create)
    );
  }
  if (routeController.update) {
    app.put(
      `/api/${routeName}/:id`,
      makeHandlerAwareOfAsyncErrors(routeController.update)
    );
  }
  if (routeController.remove) {
    app.delete(
      `/api/${routeName}/:id`,
      makeHandlerAwareOfAsyncErrors(routeController.remove)
    );
  }
}

module.exports = app;
