const {spawn} = require('child_process');
const sourceloopCliLog = require('./debug');

function spawnProcess(cmd, cmdArgs, cwd) {
  return new Promise((resolve, reject) => {
    const spawnedProcess = spawn(cmd, cmdArgs, {...cwd});
    spawnedProcess.stdout.on('data', data => {
      sourceloopCliLog(data);
    });
    spawnedProcess.stderr.on('data', data => {
      sourceloopCliLog(data);
    });
    spawnedProcess.on('error', error => {
      console.log(`error: ${error.message}`);
      reject(error);
    });
    spawnedProcess.on('close', code => {
      resolve();
    });
  });
}

module.exports = spawnProcess;
