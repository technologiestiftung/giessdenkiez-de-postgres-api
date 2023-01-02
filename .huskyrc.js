const commands = ["lint-staged"];

module.exports = {
  hooks: {
    "pre-commit": commands.join(" && "),
  },
};
