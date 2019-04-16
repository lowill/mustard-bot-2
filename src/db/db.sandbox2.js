const DB = require('./DB');
const DBUtils = require('./DBUtils');

async function test() {
  await DBUtils.setup(DB);
  const testItem = {
    key: 'foo',
    value: 'bar'
  };
  await DBUtils.setItem(DB, testItem.key, testItem.value, '0000', '0000', '0000');
  const gottenItem = await DBUtils.getItem(DB, testItem.key);
  console.log(gottenItem);
  const gottenItemUserTest = await DBUtils.getItem(DB, testItem.key, '0000');
  console.log(gottenItemUserTest);
}

test();