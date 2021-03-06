/* eslint-disable node/no-process-exit */
/* eslint-disable node/no-process-env */
import dotenv from "dotenv";
import Fastify from "fastify";

dotenv.config();

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
// eslint-disable-next-line import/no-default-export
export default async (req, res) => {
  await app.ready();
  app.server.emit("request", req, res);
};
