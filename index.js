// Do not process anything if the env is develop

const trueValues = [true, 'true', 'TRUE'];

if (process.env.VERBOSE && trueValues.includes(process.env.VERBOSE)) {
  return;
}

const path = require('path');
const fs = require('fs-extra');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageObj = fs.readJsonSync(packageJsonPath);
const appName = packageObj.name || 'app';

// Custom format of the logs
const generateItFormat = printf((info) => {
  return `[${info.label}] ${info.timestamp} ${info.level}: ${JSON.stringify(info.message)}`;
});

// Custom logging handler
const logger = createLogger({
  format: combine(colorize(), label({ label: appName }), timestamp(), generateItFormat),
  transports: [new transports.Console()],
});

function formatArgs(args){
  return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}

// Override the base console log with winston
console.log = function () {
  return logger.info.apply(logger, formatArgs(arguments));
};
console.error = function () {
  return logger.error.apply(logger, formatArgs(arguments));
};
console.info = function () {
  return logger.warn.apply(logger, formatArgs(arguments));
};

