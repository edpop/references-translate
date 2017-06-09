const EOL = require('os').EOL;
const assert = require('assert');

const patterns = require('./patterns');
const transliterate = require('./transliterate');

module.exports = referencesLocalization;

/**
 * @param {String} input
 * @return {String}
 */
function referencesLocalization (input) {
	return input.split(EOL).map(processString).join(EOL);
}

/**
 * @param {String} input
 * @return {String}
 */
function processString (input) {
	if (input.trim() === '') {
		return input;
	}

	let start = [];
	let end = [];

	const space = ' ';
	const words = input.split(space);

	let caret = 0;

	try {
		/**
		 * Порядковый номер
		 */
		const number = words[caret];
		assert(/^\d+\.$/.test(number), 'ожидается порядковый номер с точкой');
		start.push(number);
		caret++;

		/**
		 * Список фамилий и иинициалов через запятую
		 */
		let nextAuthor = true;
		while (nextAuthor) {
			let family = words[caret];
			assert(patterns.isFamily(family), 'ожидается фамилия');
			start.push(transliterate(family));
			caret++;

			let initials = words[caret];
			if (initials.length === 5) {
				assert(initials[4] === ',', 'ожидается запятая');
				initials = initials.substr(0, 4);
			} else {
				nextAuthor = false;
			}

			assert(patterns.isInitials(initials), 'ожидаются инициалы');
			start.push(transliterate(initials));
			caret++;
		}
		/**
		 * После фамилий ставится запятая
		 */
		start[caret-1] += ',';

		end = words.splice(caret);
	} catch (err) {
		console.error(`Ошибка в \`${words[caret]}\``);
		console.error(err.message);
		process.exit(1);
	}

	return start.join(space) + space + end.join(space);
}
