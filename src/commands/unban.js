const DiscordUtils = require('../discord/DiscordUtils');
const PermissionUtils = require('../utils/PermissionUtils');

const commandName = `unban`;
const description = `Unbans a user.`;
const argNames = ['userId|username#discriminator|@mention'];
const permission = PermissionUtils.PERMISSION_LEVELS.ADMINISTRATOR;

function createExecute({ }) {
  return async function execute({ client, message, args }) {

    const userIdentifier = args[0];
    if(!args[0]) throw new Error(`You must provide a user identifier to use this command.`);

    const unbanTarget = await DiscordUtils.resolveUser(client, userIdentifier); 
    return message.guild.unban(unbanTarget.id)
      .then(() => message.channel.send(`Unbanned user ${unbanTarget.username}`))
      .catch(err => {
        console.error(err);
        return new Error(`Failed to unban user ${unbanTarget.username}`);
      });
  }
}

module.exports = {
  commandName,
  description,
  argNames,
  permission,
  createExecute
};