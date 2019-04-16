const db = require('./db');
const dbutils = require('./dbutils');

async function test() {
  await dbutils.setup(db);
  const testItem = {
    key: 'foo',
    value: 'bar'
  };
  await dbutils.setItem(db, testItem.key, testItem.value, '0000', '0000', '0000');
  const gottenItem = await dbutils.getItem(db, testItem.key);
  console.log(gottenItem);
  const gottenItemUserTest = await dbutils.getItem(db, testItem.key, '0000');
  console.log(gottenItemUserTest);
}

test();