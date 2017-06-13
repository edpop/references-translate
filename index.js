const EOL = '\n'; //require('os').EOL;
const assert = require('assert');

const patterns = require('./patterns');
const transliterate = require('./transliterate');

const replacements = require('./replacements');

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
	let endAsText = '';

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
			assert(family && patterns.isFamily(family), 'ожидается фамилия');
			start.push(transliterate(family) + ',');
			caret++;

			let initials = words[caret];
			assert(initials, 'ожидаются инициалы');
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
		 * После списка фамилий и инициалов ставится запятая
		 */
		start[caret-1] += ',';

		endAsText = words.splice(caret).join(space);

		replacements.forEach(function (replacement) {
            endAsText = endAsText.replace(replacement.from, replacement.to);
        });
	} catch (err) {
		let wordError = words[caret];
		wordError = wordError ? `в \`${wordError}\`` : `после \`${words[caret-1]}\``;
		console.error(`Ошибка ${wordError}:\n${err.message}`);
	}

	return start.join(space) + space + endAsText;
}
