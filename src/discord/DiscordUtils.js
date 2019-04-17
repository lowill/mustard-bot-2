function resolveUser(client, identifier) {
  return new Promise((resolve, reject) => {
    const idMatch = identifier.match(/^\d+$/);
    if(idMatch !== null) {
      resolve(client.fetchUser(identifier, true));
      return;
    }

    const discriminatorMatch = identifier.match(/^(.*)#(\d{4})$/g);
    if(discriminatorMatch !== null) {
      resolve(client.users.get(user => user.username === discriminatorMatch[1] && user.discriminator === discriminatorMatch[2]));
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

module.exports = {
  resolveUser
};