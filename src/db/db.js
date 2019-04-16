const sqlite = require('sqlite3').verbose();

function getConnection(dbName='mustard_bot.sqlite') {

  const connection = new sqlite.Database(dbName);

  const run = (sql, params) => new Promise((resolve, reject) => {
    connection.run(sql, params, err => {
      if(err === null) resolve();
      else reject(err);
    });
  });

  const get = (sql, params) => new Promise((resolve, reject) => {
    connection.get(sql, params, (err, row) => {
      if(err === null) resolve(row);
      else reject(err);
    });
  });

  const all = (sql, params) => new Promise((resolve, reject) => {
    connection.all(sql, params, (err, rows) => {
      if(err === null) resolve(rows);
      else reject(err);
    });
  });

  const close = () => new Promise((resolve, reject) => {
    connection.close(err => {
      if(err === null) resolve(`Successfully closed the connection.`);
      else reject(err);
    });
  });

  return {
    DB: connection,
    run,
    get,
    all,
    close
  };
}



module.exports = getConnection();
module.exports.getConnection = getConnection;