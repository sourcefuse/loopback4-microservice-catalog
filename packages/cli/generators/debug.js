function sourceloopCliLog(message) {
  if (process.env.sourceloopCliLog === 'true') {
    console.log(`${message}`);
  }
}

module.exports = sourceloopCliLog;
