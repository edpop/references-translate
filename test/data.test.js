const assert = require('assert');
const fs = require('fs');
const path = require('path');

const fileActual = 'actual.txt';
const fileExpected = 'expected.txt';
const readFileOpts = { encoding: 'utf-8' };

const referencesLocalization = require('../');

const dataDir = path.join(__dirname, 'data');
const dirs = fs.readdirSync(dataDir);

dirs.forEach(function (dir) {
	console.info(`Тестируем ${dir}`);
	const actual = fs.readFileSync(path.join(dataDir, dir, fileActual), readFileOpts);
	const expected = fs.readFileSync(path.join(dataDir, dir, fileExpected), readFileOpts);
	assert.strictEqual(referencesLocalization(actual), expected);
});
