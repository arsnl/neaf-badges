import ReactDOMServer from "react-dom/server";
import R from "ramda";
import { PeppyBadge } from "./peppy-badge";

const getStyleFromRequest = R.pipe(
  R.pathOr("classic", ["query", "style"]),
  (style) => (style === "classic" || style === "flat" ? style : "classic")
);

// eslint-disable-next-line import/no-default-export
export default async (fastify, options) => {
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
