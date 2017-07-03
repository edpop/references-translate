require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./referencesLocalization":[function(require,module,exports){
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

},{"./patterns":1,"./replacements":2,"./transliterate":3}],1:[function(require,module,exports){
const cyrillicLower = 'а-яё';
const cyrillicUpper = 'А-ЯЁ';
const latinLower = 'a-z';
const latinUpper = 'A-Z';

const reLower = new RegExp('^['+cyrillicLower+latinLower+']+$');
//const reLower = /^[a-zа-я]+$/;
const reUpper = new RegExp('^['+cyrillicUpper+latinUpper+']+$');
//const reUpper = /^[A-ZА-Я]+$/;
const reCyrillic = new RegExp('^['+cyrillicLower+cyrillicUpper+']+$');
//const reCyrillic = /^[а-яА-Я]+$/;
const reLatin = new RegExp('^['+latinLower+latinUpper+']+$');
//const reLatin = /^[a-zA-Z]+$/;

const isLower = (str) => reLower.test(str);
const isUpper = (str) => reUpper.test(str);
const isCyrillic = (str) => reCyrillic.test(str);
const isLatin = (str) => reLatin.test(str);
const isWord = (str) => isLatin(str) || isCyrillic(str);
const isFamily = (str) => str.split('-').every(
	(s) => isWord(s) && isUpper(s[0]) && (s.length === 1 || isLower(s.substr(1)))
);

const dot = '.';
const isInitials = (str) => (
	str[1] === dot && (
		(str.length === 2 && isWord(str[0]) && isUpper(str[0])) ||
		(str.length === 4 && str[3] === dot && isWord(str[0]+str[2]) && isUpper(str[0]+str[2]))
	)
);


module.exports.isLower = isLower;
module.exports.isUpper = isUpper;
module.exports.isCyrillic = isCyrillic;
module.exports.isLatin = isLatin;
module.exports.isFamily = isFamily;
module.exports.isInitials = isInitials;

},{}],2:[function(require,module,exports){
class Replacement {
	/**
	 * @param {RegExp} from
	 * @param {String} to
	 */
	constructor(from, to) {
		this.from = from;
		this.to = to;
	}
}

/**
 * @type {Array.<Replacement>}
 */
module.exports = [
	new Replacement(/ (?:С|P)\. /, ' pp. '),
	new Replacement(/№/, 'no.'),
	new Replacement(/ (?:Т|Vol)\./, ' vol.'),
	new Replacement(/\. (\d\d\d\d)/, ', $1'),
	new Replacement(/ \d+ [с|p]\./, ''),
	new Replacement(/ \/\/ /, ', '),
	new Replacement(/(\d+)\./g, '$1,'),
	new Replacement(/,$/, '.')
];

},{}],3:[function(require,module,exports){
const patterns = require('./patterns');

const cyrillic2latin = {
	а: 'a', б: 'b', в: 'v', г: 'g',
	д: 'd', е: 'e', ё: 'e', ж: 'zh',
	з: 'z', и: 'i', й: 'i', к: 'k',
	л: 'l', м: 'm', н: 'n', о: 'o',
	п: 'p', р: 'r', с: 's', т: 't',
	у: 'u', ф: 'f', х: 'h', ц: 'ts',
	ч: 'ch', ш: 'sh', щ: 'sh', ъ: '',
	ы: 'i', ь: '', э: 'e', ю: 'u', я: 'ya'
};

function transliterate (str) {
	let out = '';
	for (let i = 0; i < str.length; i++) {
		const letter = str[i];
		if (!patterns.isCyrillic(letter)) {
			out += letter;
		} else if (patterns.isUpper(letter)) {
			const letters = cyrillic2latin[letter.toLowerCase()];
			out += letters[0].toUpperCase() + letters.substr(1);
		} else {
			out += cyrillic2latin[letter];
		}
	}
	return out;
}

module.exports = transliterate;

},{"./patterns":1}]},{},[]);
