const commands = [
  "cross-env NODE_ENV=test npm test -- --coverage=false --no-watch",
  "lint-staged",
];

// module.exports = require("@inpyjamas/scripts/husky");
module.exports = {
  hooks: {
    "pre-commit": commands.join(" && "),
  },
};
