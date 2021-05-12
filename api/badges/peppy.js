const badgen = require("../badgen");
const R = require("ramda");

const ESLINT_ICON =
  "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJ3aGl0ZXNtb2tlIiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+RVNMaW50IGljb248L3RpdGxlPjxwYXRoIGQ9Ik03LjI1NyA5LjEzMkwxMS44MTYgNi41YS4zNjkuMzY5IDAgMCAxIC4zNjggMGw0LjU1OSAyLjYzMmEuMzY5LjM2OSAwIDAgMSAuMTg0LjMydjUuMjYzYS4zNy4zNyAwIDAgMS0uMTg0LjMxOWwtNC41NTkgMi42MzJhLjM2OS4zNjkgMCAwIDEtLjM2OCAwbC00LjU1OS0yLjYzMmEuMzY5LjM2OSAwIDAgMS0uMTg0LS4zMlY5LjQ1MmEuMzcuMzcgMCAwIDEgLjE4NC0uMzJNMjMuODUyIDExLjUzbC01LjQ0Ni05LjQ3NWMtLjE5OC0uMzQzLS41NjQtLjU5Ni0uOTYtLjU5Nkg2LjU1NWMtLjM5NiAwLS43NjIuMjUzLS45Ni41OTZMLjE0OSAxMS41MDlhMS4xMjcgMS4xMjcgMCAwIDAgMCAxLjExN2w1LjQ0NyA5LjM5OGMuMTk3LjM0Mi41NjMuNTE3Ljk1OS41MTdoMTAuODkzYy4zOTUgMCAuNzYtLjE3Ljk1OS0uNTEybDUuNDQ2LTkuNDEzYTEuMDY5IDEuMDY5IDAgMCAwIDAtMS4wODZtLTQuNTEgNC41NTZhLjQuNCAwIDAgMS0uMjA0LjMzOEwxMi4yIDIwLjQyNmEuMzk1LjM5NSAwIDAgMS0uMzkyIDBsLTYuOTQzLTQuMDAyYS40LjQgMCAwIDEtLjIwNS0uMzM4VjguMDhjMC0uMTQuMDgzLS4yNjkuMjA0LS4zMzhMMTEuOCAzLjc0Yy4xMi0uMDcuMjcyLS4wNy4zOTIgMGw2Ljk0MyA0LjAwM2EuNC40IDAgMCAxIC4yMDYuMzM4eiIvPjwvc3ZnPg==";

const getStyleFromRequest = R.pipe(
  R.pathOr("classic", ["query", "style"]),
  (style) => (style === "classic" || style === "flat" ? style : "classic")
);

module.exports = async (fastify, options) => {
  fastify.get("/peppy.svg", options, async (request, reply) => {
    const style = getStyleFromRequest(request);
    const svgString = badgen({
      subject: "config",
      status: "peppy",
      labelColor: "black",
      icon: ESLINT_ICON,
      iconWidth: 15,
      gradient: ["ff00cc", "FFB739", "b0ff31"],
      style,
    });

    return reply.type("image/svg+xml; charset=utf-8").send(svgString);
  });
};
