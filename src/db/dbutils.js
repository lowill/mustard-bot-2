const storeTableName = 'store';

function setup(db) {
  return db.run(`
    CREATE TABLE
    IF NOT EXISTS ${storeTableName} (
      user_id TEXT,
      server_id TEXT,
      channel_id TEXT,
      key TEXT UNIQUE,
      value TEXT
    )
  `);
}

function setItem({ db, key, value, userId, serverId, channelId }) {
  return db.run(`
    INSERT OR REPLACE
    INTO ${storeTableName} (
      user_id,
      server_id,
      channel_id,
      key,
      value
    )
    VALUES (
      ?,
      ?,
      ?,
      ?,
      ?
    )
  `, [userId, serverId, channelId, key, value]
  ).catch(err => { 
    console.error(`Failed to set item ::: ${key}: ${value}\n`, err);
    return err; 
  });
}

function getItem({ db, key, userId=null, serverId=null, channelId=null }) {
  const params = [key];
  if(userId !== null) params.push(userId);
  if(serverId !== null) params.push(serverId);
  if(channelId !== null) params.push(channelId);

  return db.get(`
    SELECT *
    FROM ${storeTableName}
    WHERE key = ?
    ${userId !== null ? 'AND user_id = ? ' : ''}
    ${serverId !== null ? 'AND server_id = ? ' : ''}
    ${channelId !== null ? 'AND channel_id = ? ' : ''}
  `, params);
}

module.exports = {
  setup,
  setItem,
  getItem
};