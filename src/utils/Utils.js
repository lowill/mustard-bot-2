/** 
Returns an array of paths for files in a given directory (use project root directory as projectPath).

Important to note that fs.readdir uses process.cwd() as its starting point whereas require uses __dirname
This utility function makes it simpler to get all file names for a specific directory.
*/

function getAbsoluteFilePaths({ fs, pathUtil, projectPath, process }) {

  const absolutePath = pathUtil.resolve(process.cwd(), projectPath);
  const fileNames = fs.readdirSync(absolutePath);

  const absolutePaths = fileNames.map(fileName => pathUtil.resolve(absolutePath, fileName));

  return absolutePaths;

}


/**
Commands will include some usage text, this function simply assembles the string.
*/
function createUsageString({ commandPrefix, commandName, argNames=[], helpText="" }) {
  return `Usage: ${'``'}${commandPrefix}${commandName} ${argNames.join(' ')}${'``'} ${helpText}`;
}

module.exports = {
  getAbsoluteFilePaths,
  createUsageString
};