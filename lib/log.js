const core = require('@actions/core');

function log(message) {
  if (process.env.TESTING) {
    return;
  }

  core.log(message);
}

module.exports = { log };
