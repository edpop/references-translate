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
	input = input.trim();

	if (input === '') {
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
		// Ожидается порядковый номер с точкой
		if (/^\d+\.$/.test(number)) {
			start.push(number);
			caret++;
		}

		/**
		 * Список фамилий и иинициалов через запятую
		 */
		let nextAuthor = true;
		const authors = [];
		while (nextAuthor) {
			let family = words[caret];
			assert(family && patterns.isFamily(family), 'ожидается фамилия');
			caret++;

			let initials = words[caret];
			assert(initials, 'ожидаются инициалы');
			if (initials.endsWith(',')) {
				initials = initials.substr(0, initials.length - 1);
			} else {
				nextAuthor = false;
			}

			assert(patterns.isInitials(initials), 'ожидаются инициалы');
			caret++;

			authors.push(transliterate(family) + ',' + space + transliterate(initials));
		}

		/**
		 * Склеиваем авторов через запятую
		 * Перед последним автором ставится "and" вместо запятой
		 * После списка фамилий и инициалов ставится запятая
		 */
		for (let i = 0; i < authors.length; i++) {
			const andOrComma = i === authors.length - 2 && authors.length > 1 ? ' and' : ',';
			start.push(authors[i] + andOrComma);
		}

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
