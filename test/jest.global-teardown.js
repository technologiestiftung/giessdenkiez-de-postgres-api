/* eslint-disable @typescript-eslint/no-var-requires */
// https://jestjs.io/docs/en/configuration#globalteardown-string
const spawn = require("cross-spawn");
const waitOn = require("wait-on");

module.exports = async () => {
  const exitHandler = () => {
    const result = spawn.sync("docker-compose", ["stop"], {
      stdio: "inherit",
    });
    waitOn({
      reverse: true,
      resources: ["tcp:127.0.0.1:5432"],
      // delay: 250, // initial delay in ms, default 0
    })
      .then(() => {
        console.log(result.stdout ? result.stdout.toString() : "");
        console.log(result.stderr ? result.stderr.toString() : "");
        spawn.sync("docker-compose", ["down"], {
          stdio: "inherit",
        });
        console.log("jest exit");
      })
      .catch((err) => {
        console.error(err);
      });
  };
  process.on("exit", exitHandler);
  process.on("SIGABRT", exitHandler);
  process.on("SIGINT", exitHandler);
  process.on("uncaughtException", exitHandler);
};
