/* eslint-disable import/no-default-export */
// Read the .env file.
const dotenv = require("dotenv");
const Fastify = require("fastify");

dotenv.config();

// Instantiate Fastify with some config
const app = Fastify({
  logger: true,
});

// Register your application as a normal plugin.
app.register(require("../src/app"));

export default async (req, res) => {
  await app.ready();
  app.server.emit("request", req, res);
};
