/* eslint-disable import/no-default-export */
/* eslint-disable security/detect-unsafe-regex */
/* eslint-disable no-param-reassign */
const calcWidth = require("./calc-text-width").Verdana110;
const colorPresets = require("./color-presets");

const sanitize = (str) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const createAccessibleText = ({ label, status }) => {
  const labelPrefix = label ? `${label}: ` : "";
  return labelPrefix + status;
};

const typeAssert = (assertion, message) => {
  if (!assertion) throw new TypeError(message);
};

const useColor = (svgString, color) =>
  svgString.replace(
    /(<g(?:.+\n\s+<rect){2}.+fil{2}=")([^"]+)(")/g,
    `$1${color}$3`
  );

const addGradient = (svgString, gradient, id) => {
  let svgGradient = `  <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="0%">`;
  gradient.forEach((v, i) => {
    const offset = Math.round((100 * i) / (gradient.length - 1));
    const color = colorPresets[gradient[i]] || gradient[i];
    svgGradient += `\n    <stop offset="${offset}%" style="stop-color:#${color}" />`;
  });

  svgGradient += "\n  </linearGradient>\n</svg>";

  return svgString
    .replace("</svg>", svgGradient)
    .replace(/(<g(?:.+\n\s+<rect){2}.+fil{2}=")([^"]+)(")/g, "$1url(#x)$3");
};

const applyGradient = (svgString, gradient) => {
  if (!Array.isArray(gradient) || gradient.length === 0) {
    return svgString;
  }
  if (gradient.length === 1) {
    const color = colorPresets[gradient[0]] || gradient[0];
    return useColor(svgString, `#${color}`);
  }
  return useColor(addGradient(svgString, gradient, "x"), "url(#x)");
};

const bare = ({ status, color, style, scale }) => {
  typeAssert(typeof status === "string", "<status> must be string");
  color = colorPresets[color] || color || colorPresets.blue;

  const stTextWidth = calcWidth(status);
  const stRectWidth = stTextWidth + 115;

  status = sanitize(status);
  color = sanitize(color);

  if (style === "flat") {
    return `<svg width="${(scale * stRectWidth) / 10}" height="${
      scale * 20
    }" viewBox="0 0 ${stRectWidth} 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${status}">
  <title>${status}</title>
  <g>
    <rect fill="#${color}" x="0" width="${stRectWidth}" height="200"/>
  </g>
  <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text x="65" y="148" textLength="${stTextWidth}" fill="#000" opacity="0.1">${status}</text>
    <text x="55" y="138" textLength="${stTextWidth}">${status}</text>
  </g>
</svg>`;
  }

  return `<svg width="${(scale * stRectWidth) / 10}" height="${
    scale * 20
  }" viewBox="0 0 ${stRectWidth} 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${status}">
  <title>${status}</title>
  <linearGradient id="a" x2="0" y2="100%">
    <stop offset="0" stop-opacity=".1" stop-color="#EEE"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <mask id="m"><rect width="${stRectWidth}" height="200" rx="30" fill="#FFF"/></mask>
  <g mask="url(#m)">
    <rect width="${stRectWidth}" height="200" fill="#${color}" x="0"/>
    <rect width="${stRectWidth}" height="200" fill="url(#a)"/>
  </g>
  <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text x="65" y="148" textLength="${stTextWidth}" fill="#010101" fill-opacity="0.3">${status}</text>
    <text x="55" y="138" textLength="${stTextWidth}">${status}</text>
  </g>
</svg>`;
};

const generateBadge = ({
  label,
  subject,
  status,
  color = "blue",
  style,
  icon,
  iconWidth = 13,
  labelColor = "555",
  scale = 1,
}) => {
  typeAssert(typeof status === "string", "<status> must be string");

  label = label === undefined ? subject : label; // subject is deprecated
  if (!label && !icon) {
    return bare({ status, color, style, scale });
  }

  color = colorPresets[color] || color;
  labelColor = colorPresets[labelColor] || labelColor;
  iconWidth *= 10;

  const iconSpanWidth = icon
    ? label.length
      ? iconWidth + 30
      : iconWidth - 18
    : 0;
  const sbTextStart = icon ? iconSpanWidth + 50 : 50;
  const sbTextWidth = calcWidth(label);
  const stTextWidth = calcWidth(status);
  const sbRectWidth = sbTextWidth + 100 + iconSpanWidth;
  const stRectWidth = stTextWidth + 100;
  const width = sbRectWidth + stRectWidth;
  const xlink = icon ? ' xmlns:xlink="http://www.w3.org/1999/xlink"' : "";

  label = sanitize(label);
  status = sanitize(status);
  color = sanitize(color);
  labelColor = sanitize(labelColor);
  icon = icon ? sanitize(icon) : icon;
  const accessibleText = createAccessibleText({ label, status });

  if (style === "flat") {
    return `<svg width="${(scale * width) / 10}" height="${
      scale * 20
    }" viewBox="0 0 ${width} 200" xmlns="http://www.w3.org/2000/svg"${xlink} role="img" aria-label="${accessibleText}">
  <title>${accessibleText}</title>
  <g>
    <rect fill="#${labelColor}" width="${sbRectWidth}" height="200"/>
    <rect fill="#${color}" x="${sbRectWidth}" width="${stRectWidth}" height="200"/>
  </g>
  <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110">
    <text x="${
      sbTextStart + 10
    }" y="148" textLength="${sbTextWidth}" fill="#000" opacity="0.1">${label}</text>
    <text x="${sbTextStart}" y="138" textLength="${sbTextWidth}">${label}</text>
    <text x="${
      sbRectWidth + 55
    }" y="148" textLength="${stTextWidth}" fill="#000" opacity="0.1">${status}</text>
    <text x="${
      sbRectWidth + 45
    }" y="138" textLength="${stTextWidth}">${status}</text>
  </g>
  ${
    icon
      ? `<image x="40" y="35" width="${iconWidth}" height="132" xlink:href="${icon}"/>`
      : ""
  }
</svg>`;
  }

  return `<svg width="${(scale * width) / 10}" height="${
    scale * 20
  }" viewBox="0 0 ${width} 200" xmlns="http://www.w3.org/2000/svg"${xlink} role="img" aria-label="${accessibleText}">
  <title>${accessibleText}</title>
  <linearGradient id="a" x2="0" y2="100%">
    <stop offset="0" stop-opacity=".1" stop-color="#EEE"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <mask id="m"><rect width="${width}" height="200" rx="30" fill="#FFF"/></mask>
  <g mask="url(#m)">
    <rect width="${sbRectWidth}" height="200" fill="#${labelColor}"/>
    <rect width="${stRectWidth}" height="200" fill="#${color}" x="${sbRectWidth}"/>
    <rect width="${width}" height="200" fill="url(#a)"/>
  </g>
  <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110">
    <text x="${sbTextStart}" y="148" textLength="${sbTextWidth}" fill="#010101" fill-opacity="0.3">${label}</text>
    <text x="${sbTextStart}" y="138" textLength="${sbTextWidth}">${label}</text>
    <text x="${
      sbRectWidth + 45
    }" y="148" textLength="${stTextWidth}" fill="#010101" fill-opacity="0.3">${status}</text>
    <text x="${
      sbRectWidth + 45
    }" y="138" textLength="${stTextWidth}">${status}</text>
  </g>
  ${
    icon
      ? `<image x="40" y="35" width="${iconWidth}" height="130" xlink:href="${icon}"/>`
      : ""
  }
</svg>`;
};

module.exports = (options) =>
  options.gradient
    ? applyGradient(generateBadge(options), options.gradient)
    : generateBadge(options);
