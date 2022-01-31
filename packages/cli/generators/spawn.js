const {spawn} = require('child_process');

 function spawnProcess(cmd, cmdArgs, cwd) {
    return new Promise((resolve, reject) => {
      const spawnedProcess = spawn(cmd, cmdArgs, {...cwd});
      spawnedProcess.on("data", data => {
          console.log(`${data}`);
      });
      spawnedProcess.on("data", data => {
          console.log(`${data}`);
      });
      spawnedProcess.on('error', (error) => {
          console.log(`error: ${error.message}`);
          reject(error);
      });
      spawnedProcess.on("close", code => {
          resolve();
      });
    })
  }

module.exports = spawnProcess;
