const PermissionUtils = require('../utils/PermissionUtils');

const commandName = `set-permission`;
const description = `You can set a role to be an administrator or moderator using this command.`;
const permission = PermissionUtils.PERMISSION_LEVELS.SERVER_OWNER;

const argNames = ['roleName', 'roleId'];

const administrator = PermissionUtils.PERMISSION_LEVELS.ADMINISTRATOR;
const moderator = PermissionUtils.PERMISSION_LEVELS.MODERATOR;

function createExecute({ DB, commandPrefix }) {

  function execute({ client, message, args }) {
    if(args.length < 2) throw new Error(`Invalid number of arguments.  Try ${commandPrefix}help to see usage.`);

    // match the role argument
    const permissionArg = args[0];
    let targetPermission;

    switch(permissionArg) {
      case administrator.name.toLowerCase():
        targetPermission = administrator;
        break;

      case moderator.name.toLowerCase():
        targetPermission = moderator;
        break;

      default:
        targetPermission = null;
        break;
    }

    if(targetPermission === null) throw new Error("Permission argument must be either ``administrator`` or ``moderator``")

    const guild = message.guild;
    const roleIdMatch = args[1].match(/<?@?&?(\d+)>?/);
    if(roleIdMatch === null) throw new Error(`Invalid RoleId.`);
    const roleId = roleIdMatch[1];

    if(!guild.roles.has(roleId)) throw new Error(`Could not find that role on this server.`);

    return PermissionUtils.setPermissionRole({ DB, permission: targetPermission, serverId: guild.id, roleId, userId: message.author.id })
      .then(() => message.channel.send(`Successfully set permission!`))
      .catch(err => {
        console.error(err);
        return new Error(`Failed to write the permission/role to the database.`);
      });

  }

  return execute;

}



module.exports = {
  commandName,
  description,
  permission,
  argNames,
  createExecute
}