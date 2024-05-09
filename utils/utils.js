const chalk = require("chalk");

exports.makeRainbow = (string) => {
  const colours = {
    0: chalk.red,
    1: chalk.hex("#FFA500"),
    2: chalk.yellow,
    3: chalk.green,
    4: chalk.blue,
    5: chalk.hex("#A020F0"),
  };
  return string
    .split("")
    .map((character, index) => colours[index % 6](character))
    .join("");
};

exports.styleError = (string) => {
  return chalk.red.bold(string.toUpperCase());
};
