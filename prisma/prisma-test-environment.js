/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
const path = require("path");
// const fs = require("fs");
const util = require("util");
// const spawn = require("cross-spawn");
// const waitOn = require("wait-on");
const isCi = require("is-ci");
const NodeEnvironment = require("jest-environment-node");
const exec = util.promisify(require("child_process").exec);

const prismaBinary = path.join(
  __dirname,
  "..",
  "node_modules",
  ".bin",
  "prisma",
);

class PrismaTestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);

    process.env.DATABASE_URL =
      "postgresql://fangorn:ent@localhost:5432/trees?schema=public";
    this.global.process.env.DATABASE_URL =
      "postgresql://fangorn:ent@localhost:5432/trees?schema=public";
  }

  async setup() {
    // spawn.sync("docker-compose", ["down"], {
    //   stdio: "inherit",
    // });
    // spawn.sync(
    //   "docker-compose",
    //   ["-f", "docker-compose.test.yml", "up", "-d"],
    //   {
    //     stdio: "inherit",
    //   },
    // );
    // Run the migrations to ensure our schema has the required structure
    await exec(
      `${prismaBinary} db push --preview-feature —-force-reset --accept-data-loss`,
    );
    return super.setup();
  }

  async teardown() {
    if (isCi === true) {
      return;
    }
    // const exitHandler = () => {
    //   const result = spawn.sync("docker-compose", ["stop"], {
    //     stdio: "inherit",
    //   });
    //   waitOn({
    //     reverse: true,
    //     resources: ["tcp:127.0.0.1:5432"],
    //     // delay: 250, // initial delay in ms, default 0
    //   })
    //     .then(() => {
    //       console.log(result.stdout ? result.stdout.toString() : "");
    //       console.log(result.stderr ? result.stderr.toString() : "");
    //       spawn.sync("docker-compose", ["down"], {
    //         stdio: "inherit",
    //       });
    //       console.log("jest exit");
    //     })
    //     .catch((err) => {
    //       console.error(err);
    //     });
    // };
    // process.on("exit", exitHandler);
    // process.on("SIGABRT", exitHandler);
    // process.on("SIGINT", exitHandler);
    // process.on("uncaughtException", exitHandler);
  }
}

module.exports = PrismaTestEnvironment;
