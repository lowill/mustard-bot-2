const tableNamePermissions = 'permissions';
const DiscordUtils = require('../discord/DiscordUtils');

const PERMISSION_LEVELS = {};

PERMISSION_LEVELS['BOT_OWNER'] = {
  key: 'BOW_OWNER',
  level: 0,
  name: 'Bot Owner'
};
PERMISSION_LEVELS['SERVER_OWNER'] = {
  key: 'SERVER_OWNER',
  level: 1,
  name: 'Server Owner'
};
PERMISSION_LEVELS['ADMINISTRATOR'] = {
  key: 'ADMINISTRATOR',
  level: 2,
  name: 'Administrator'
};
PERMISSION_LEVELS['MODERATOR'] = {
  key: 'MODERATOR',
  level: 3,
  name: 'Moderator'
};
PERMISSION_LEVELS['GENERAL'] = {
  key: 'GENERAL',
  level: 9999,
  name: 'General'
};

function setupPermissionsTable(DB) {
  return DB.run(`
    CREATE TABLE
    IF NOT EXISTS
    ${tableNamePermissions} (
      role_id TEXT UNIQUE,
      server_id TEXT NOT NULL,
      permission_key TEXT NOT NULL,
      permission_level TEXT NOT NULL,
      set_by_user_id TEXT,
      PRIMARY KEY( server_id, permission_key )
    )

  `);
}

// map users to permission levels
// check if user has permission

function setPermissionRole({ DB, permission, serverId, roleId, userId }) {
  return DB.run(`
    INSERT OR REPLACE INTO ${tableNamePermissions} (
      role_id,
      server_id,
      permission_key,
      permission_level,
      set_by_user_id
    )
    VALUES (
      ?, ?, ?, ?, ?
    )
  `, [roleId, serverId, permission.key, permission.level, userId]);
}

function getPermissionRoles(DB, serverId) {
  return DB.all(`
    SELECT *
    FROM ${tableNamePermissions}
    WHERE server_id = ?
  `, [serverId]);
}

async function getUserPermission({ DB, user, guild }) {

  // Bot owner
  const ownerId = process.env.BOT_OWNER_ID;
  if(ownerId === user.id) return PERMISSION_LEVELS.BOT_OWNER;

  // Server owner
  const serverOwnerId = guild.ownerId;
  if(serverOwnerId === user.id) return PERMISSION_LEVELS.SERVER_OWNER;

  // Check that command was used in a server channel and not a DM
  if(guild == null) throw new Error(`You cannot use this command in a DM.`);

  // Other roles
  const userRoles = user.roles;
  const serverId = guild.id;

  // Find which roles are set in the database
  // Create a lookup object mapping role ids to the correct permission
  const permissionRoles = await getPermissionRoles(DB, serverId);
  const serverPermissionRoles = permissionRoles.reduce((spr, permissionRole) => {
    spr[permissionRole.role_id] = PERMISSION_LEVELS[permissionRole.permission_key];
    return spr;
  }, {});

  // Determine if the user has any of those roles
  const userRelevantPermissions = userRoles.filter(role => role.id in serverPermissionRoles);
  const userPermissions = userRelevantPermissions.map(role => serverPermissionRoles[role.id]);

  // Determine which permission is highest
  const highestUserPermission = userPermissions.reduce((acc, currentItem) => acc.level > currentItem.level ? currentItem : acc , { level: Infinity });
  return highestUserPermission;

}

module.exports = {
  setupPermissionsTable,
  setPermissionRole,
  tableNamePermissions,
  PERMISSION_LEVELS,
  getUserPermission
};