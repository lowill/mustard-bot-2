const SetupDB = require('../db/SetupDB');

function setup({ DB, client }) {
  SetupDB({ DB });
}

module.exports = setup;