#! /usr/bin/env node --max-old-space-size=4096

const { spawn } = require("child_process");

const { program } = require("commander");
const chalk = require("chalk");

const process = spawn("bash");

program
  .arguments("<*>")
  .action(async function (action, _) {
    const command = `
    cd node_modules/boim_test2 \n
    npm run ${action} \n
    `;

    function runScript() {
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
    }

    await runScript();

    console.log(chalk.bold.greenBright("Boim-Run-Script"));
  })
  .parse(process.argv);
