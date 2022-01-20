const {spawn} = require('child_process');

 function spawnProcess(cmd, cmdArgs, cwd) {
    return new Promise((resolve, reject) => {
      const spawnedProcess = spawn(cmd, cmdArgs, {...cwd});
      spawnedProcess.stdout.on("data", data => {
          console.log(`stdout: ${data}`);
      });
      spawnedProcess.stderr.on("data", data => {
          console.log(`stderr: ${data}`);
      });
      spawnedProcess.on('error', (error) => {
          console.log(`error: ${error.message}`);
          reject(error);
      });
      spawnedProcess.on("close", code => {
          resolve();
      });
    })
  };

module.exports = spawnProcess;