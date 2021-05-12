/* eslint-disable node/no-process-exit */
/* eslint-disable node/no-process-env */
const Fastify = require("fastify");

// Instantiate Fastify with some config
const app = Fastify({
  logger: true,
});

app.register(require("./badges/peppy/peppy-endpoint"));

if (process.env.DEV) {
  const start = async () => {
    try {
      await app.listen(process.env.PORT || 3000);
    } catch (error) {
      app.log.error(error);
      process.exit(1);
    }
  };
  start();
}
module.exports = async (req, res) => {
  await app.ready();
  app.server.emit("request", req, res);
};
