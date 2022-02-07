function sourceloopCliLog(message) {
  if (process.env.DEBUG === 'sourceloop:cli') {
    console.log(`${message}`);
  }
}

module.exports = sourceloopCliLog;
