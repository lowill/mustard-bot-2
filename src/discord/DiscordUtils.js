function resolveUser(client, identifier) {

  return new Promise((resolve, reject) => {
    const idMatch = identifier.match(/^\d+$/);
    if(idMatch !== null) {
      resolve(client.fetchUser(identifier, true));
      return;
    }

    const discriminatorMatch = identifier.match(/^(.*)#(\d{4})$/);
    if(discriminatorMatch !== null) {
      const user = client.users.find(user => user.username === discriminatorMatch[1] && user.discriminator === discriminatorMatch[2]);
      resolve(user);
      return;
    }

    const mentionMatch = identifier.match(/^<@!?(\d+)>$/);
    if(mentionMatch !== null) {
      resolve(client.fetchUser(mentionMatch[1], true));
      return;
    }

    return reject(`Failed to resolve user.`);
  });

}

function getGuildMember(message) {

  const guild = message.guild;
  const authorId = message.author.id;

  const guildMember = guild.members.get(authorId);
  if(guildMember == null) throw new Error('Could not retrieve roles for user.');

  return guildMember;
  
}

module.exports = {
  resolveUser,
  getGuildMember
};