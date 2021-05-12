"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _server = _interopRequireDefault(require("react-dom/server"));

var _ramda = _interopRequireDefault(require("ramda"));

var _peppyBadge = require("./peppy-badge");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getStyleFromRequest = _ramda.default.pipe(_ramda.default.pathOr("classic", ["query", "style"]), style => style === "classic" || style === "flat" ? style : "classic"); // eslint-disable-next-line import/no-default-export


var _default = async (fastify, options) => {
  const handler = forcedStyle => async (request, reply) => {
    const style = forcedStyle || getStyleFromRequest(request);

    const badge = _server.default.renderToStaticMarkup((0, _peppyBadge.PeppyBadge)({
      style
    }));

    return reply.type("image/svg+xml; charset=utf-8").send(badge);
  };

  fastify.get("/peppy", options, handler());
  fastify.get("/peppy.svg", options, handler());
  fastify.get("/peppy-classic", options, handler("classic"));
  fastify.get("/peppy-classic.svg", options, handler("classic"));
  fastify.get("/peppy-flat", options, handler("flat"));
  fastify.get("/peppy-flat.svg", options, handler("flat"));
};

exports.default = _default;