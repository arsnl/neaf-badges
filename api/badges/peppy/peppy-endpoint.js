const importJsx = require("import-jsx");
const R = require("ramda");
const ReactDOMServer = require("react-dom/server");

const PeppyBadge = importJsx("./peppy-badge");

const getStyleFromRequest = R.pipe(
  R.pathOr("classic", ["query", "style"]),
  (style) => (style === "classic" || style === "flat" ? style : "classic")
);

module.exports = async (fastify, options) => {
  const handler = (forcedStyle) => async (request, reply) => {
    const style = forcedStyle || getStyleFromRequest(request);
    const badge = ReactDOMServer.renderToStaticMarkup(PeppyBadge({ style }));

    return reply.type("image/svg+xml; charset=utf-8").send(badge);
  };

  fastify.get("/peppy", options, handler());
  fastify.get("/peppy.svg", options, handler());

  fastify.get("/peppy-classic", options, handler("classic"));
  fastify.get("/peppy-classic.svg", options, handler("classic"));

  fastify.get("/peppy-flat", options, handler("flat"));
  fastify.get("/peppy-flat.svg", options, handler("flat"));
};
