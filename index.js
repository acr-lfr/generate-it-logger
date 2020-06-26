// Do not process anything if the env is develop

const trueValues = [true, 'true', 'TRUE'];

if (process.env.VERBOSE && trueValues.includes(process.env.VERBOSE)) {
  return;
}

const path = require('path');
const fs = require('fs-extra');
const { inspect } = require('util');
const hasAnsi = require('has-ansi');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageObj = fs.readJsonSync(packageJsonPath);
const appName = packageObj.name || 'app';
const SPLAT = Symbol.for('splat');

function isPrimitive(val) {
  return val === null || (typeof val !== 'object' && typeof val !== 'function');
}
function formatWithInspect(val) {
  const prefix = isPrimitive(val) ? '' : '\n';
  const shouldFormat = typeof val !== 'string' && !hasAnsi(val);;

  return prefix + (shouldFormat ? inspect(val, { depth: null, colors: true }) : val);
}

// Custom format of the logs
const generateItFormat = printf((info) => {
  const msg = formatWithInspect(info.message);
  const splatArgs = info[SPLAT] || [];
  const rest = splatArgs.map(data => formatWithInspect(data)).join(' ');

  return `[${info.label}] ${info.timestamp} ${info.level}: ${msg} ${rest}`;
});

// Custom logging handler
const logger = createLogger({
  format: combine(  colorize(), label({ label: appName }), timestamp(), generateItFormat),
  transports: [new transports.Console()],
});

// Override the base console log with winston
console.log = function (...args) {
  return logger.info.apply(logger, [...args]);
};
console.error = function (...args) {
  return logger.error.apply(logger, [...args]);
};
console.info = function (...args) {
  return logger.warn.apply(logger, [...args]);
};

