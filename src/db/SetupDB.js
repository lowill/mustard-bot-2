const PermissionUtils = require('../utils/PermissionUtils');

function setup({ DB }) {

  // Setup Tables
  PermissionUtils.setupPermissionsTable(DB);
}

module.exports = setup;