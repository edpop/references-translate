const EOL = '\n'; //require('os').EOL;

const patterns = require('./patterns');
const transliterate = require('./transliterate');

const replacements = require('./replacements');

module.exports = referencesLocalization;

/**
 * @param {String} input
 * 
 * @typedef {Object} Answer
 * @property {String} text
 * @property {Array.<String>} warnings
 *
 * @return {Answer}
 */
function referencesLocalization (input) {
	const warnings = [];

	const text = input.split(EOL).map(processString).join(EOL);
	return {
		text,
		warnings
	};

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
		function warn (message) {
			let context = words[caret];
			let preposition = 'В';
			if (!context) {
				preposition = 'После';
				context = words[caret-1];
			}

			warnings.push(`${preposition} \`${context}\` ${message}`);
		}

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
		let currentAuthor, lastAuthor;
		while (nextAuthor) {
			let family = words[caret];

			if (!family) break;
			if (!patterns.isFamily(family)) {
				warn('фамилия не распознана');
				break;
			}
			caret++;

			let initials = words[caret];

			if (!initials) break;

			if (initials.endsWith(',')) {
				initials = initials.substr(0, initials.length - 1);
			} else {
				nextAuthor = false;
			}

			if (!patterns.isInitials(initials)) {
				warn('инициалы не распознаны');
				caret--;
				break;
			}
			caret++;

			currentAuthor = transliterate(family) + ',' + space + transliterate(initials);

			/**
			 * Склеиваем авторов через запятую
			 * Если в конце авторов нет "и другие (et al.)",
			 *   то перед последним автором ставится "and"
			 * После списка авторов ставится запятая
			 */
			if (nextAuthor) {
				if (lastAuthor) {
					authors.push(lastAuthor + ',');
				}
				lastAuthor = currentAuthor;
			} else {
				if (words[caret] === 'et' && words[caret+1] === 'al.') {
					if (lastAuthor) {
						authors.push(lastAuthor + ',');
					}
					authors.push(currentAuthor);
					authors.push('et al.,');
					caret += 2;
				} else {
					if (lastAuthor) {
						authors.push(lastAuthor + ' and');
					}
					authors.push(currentAuthor + ',');
				}
			}
		}

		start = start.concat(authors);

		const startAsText = start.length > 0 ? start.join(space) + space : '';

		endAsText = words.splice(caret).join(space);

		replacements.forEach(function (replacement) {
			endAsText = endAsText.replace(replacement.from, replacement.to);
		});

		return startAsText + endAsText;
	}
}
