const expect = require('chai').expect;  

const Utils = require('./Utils');

describe(`Utils tests`, () => {

  describe(`getAbsoluteFilePaths function`, () => {

    it(`should return an array of absolute file paths for all files in a directory`, () => {

      const path = require('path');

      const fakeFiles = ['jkl.json', 'foo.js', 'bar.js', 'baz.js', 'asdf.cpp'];
      const fakePath = './src';
      const fakeWorkingDirectory = '/test/dir';

      const deps = {
        fs: { readdirSync() { return fakeFiles; } },
        process: { cwd() { return fakeWorkingDirectory; } },
        projectPath: fakePath,
        pathUtil: path
      };

      const absPaths = Utils.getAbsoluteFilePaths(deps);

      const expectedPaths = [
        "/test/dir/src/jkl.json",
        "/test/dir/src/foo.js",
        "/test/dir/src/bar.js",
        "/test/dir/src/baz.js",
        "/test/dir/src/asdf.cpp"
      ];
      expect(absPaths).to.eql(expectedPaths);

    });

  });

});