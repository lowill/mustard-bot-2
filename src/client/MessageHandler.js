const ClientUtils = require('./ClientUtils');
const DiscordUtils = require('../discord/DiscordUtils');
const PermissionUtils = require('../utils/PermissionUtils');

async function handleMessage({ DB, commands, client, message, clientIsReady }) {

  // Wait for setup tasks to be finished
  if(clientIsReady === false) return;

  // Check that message begins with the command prefix
  const prefix = ClientUtils.getCommandPrefix();
  if(!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Check that there is a matching command  
  const command = commands.get(commandName);
  if(command == null) return;

  // We cannot use the message author property on the message because it is missing role data
  const user = DiscordUtils.getGuildMember(message);

  // Check that sender has permission to use command
  const userPermission = await PermissionUtils.getUserPermission({ DB, user, guild: message.guild });
  if(userPermission.level > command.permission.level) return message.reply(`You do not have permission to use this command.`);

  // run command
  try {
    const result = await command.execute({ client, message, args });
    if(result instanceof Error) throw result;
  }
  catch(err) {
    message.reply(`Something went wrong. ${err}`);
    console.error(message.content, err);
  }

}

module.exports = {
  handleMessage
};