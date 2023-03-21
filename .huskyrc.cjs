const commands = ["lint-staged"];

// module.exports = require("@inpyjamas/scripts/husky");
module.exports = {
  hooks: {
    "pre-commit": commands.join(" && "),
  },
};
