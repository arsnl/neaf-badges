"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var _fastify = _interopRequireDefault(require("fastify"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable node/no-process-exit */

/* eslint-disable node/no-process-env */
_dotenv.default.config(); // Instantiate Fastify with some config


const app = (0, _fastify.default)({
  logger: true
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
} // eslint-disable-next-line import/no-default-export


var _default = async (req, res) => {
  await app.ready();
  app.server.emit("request", req, res);
};

exports.default = _default;