#! /usr/bin/env node --max-old-space-size=4096

const { spawn } = require("child_process");

const { program } = require("commander");
const controller = new AbortController();
const { signal } = controller;
const chalk = require("chalk");
const process = spawn("bash", { signal });

program
  .arguments("<*>")
  .action(async function (action, _) {
    if (action === "dev" || action === "build" || action === "start") {
      const command = `
      cd node_modules/boim \n
      npm run ${action} \n
      `;

      const runScript = () => {
        return new Promise(function (resolve, reject) {
          try {
            process.stdin.write(command);
            process.stdin.end();

            process.stdout.on("data", (data) => {
              const message = data.toString();
              console.log(message);
              resolve(message);
            });

            process.on("close", function (code) {
              process.kill();
            });
          } catch (err) {
            console.log("error");
            reject(err);
          }
        });
      };

      await runScript();

      console.log(chalk.bold.greenBright("Boim-Run-Script"));
    } else {
      controller.abort();
    }
  })
  .parse(process.argv);
