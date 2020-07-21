/* eslint-disable @typescript-eslint/no-var-requires */
// https://jestjs.io/docs/en/configuration#globalsetup-string
// setup.js
// const spawn = require("cross-spawn");
const util = require("util");
const child_process = require("child_process");
const exec = util.promisify(child_process.exec);
const waitOn = require("wait-on");
const containername = "postgresdb-integration"; // "tsb-tree-api-now-express_postgres_1"
module.exports = async () => {
  // if (global.___DB_PROVISIONED___ === undefined) {
  // global.___DB_PROVISIONED___ =
  //   global.___DB_PROVISIONED___ === undefined
  //     ? false
  //     : global.___DB_PROVISIONED___;
  // } else {
  // if (global.___DB_PROVISIONED___ === true) {
  //   console.log("Schema is already build");
  // }
  // }
  try {
    const { stdout: _stdoutDCO, stderr: stderrDCO } = await exec(
      "docker-compose up -d",
    );
    await new Promise((resolve) => setTimeout(resolve, 5000));
    // global.___DB_PROVISIONED___ = true;
    // }
    // console.log("dco up stdout", stdoutDCO ? stdoutDCO : "");
    console.log("dco up stderr", stderrDCO ? stderrDCO : "");
    await waitOn({
      resources: ["tcp:127.0.0.1:5432"],
      delay: 3000, // initial delay in ms, default 0
      interval: 500,
    });

    // if (global.___DB_PROVISIONED___ === false) {
    const {
      stdout: _stdoutProvisioning,
      stderr: stderrProvisioning,
    } = await exec(
      `docker exec ${containername} psql -h 127.0.0.1 -d trees -U fangorn -q -f provisioning/build-schema.sql`,
    );
    // console.log("schema stdout", stdoutProvisioning ? stdoutProvisioning : "");
    console.log("schema stderr", stderrProvisioning ? stderrProvisioning : "");

    await waitOn({
      resources: ["tcp:127.0.0.1:5432"],
      delay: 2000, // initial delay in ms, default 0
    });

    // global.___DB_PROVISIONED___ = true;
    // }
    // console.log(
    //   "dco up stdout",
    //   resultDCUp.stdout ? resultDCUp.stdout.toString() : "",
    // );
  } catch (error) {
    if (!error.message.toLowerCase().includes("DB is allready provisioned")) {
      console.error("Error in setup", error);
    }
  }
};
