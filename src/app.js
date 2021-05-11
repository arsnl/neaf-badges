/* eslint-disable node/no-process-env */
/* eslint-disable node/no-process-exit */
const fastify = require("fastify")({
  logger: true,
});

fastify.register(require("./badges/peppy"));

const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 3000);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};
start();
